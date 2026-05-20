import { createParser } from 'nuqs';
import LZString from 'lz-string';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function encodeBase32(data: Uint8Array): string {
    let bits = 0;
    let value = 0;
    let output = '';

    for (let i = 0; i < data.length; i++) {
        value = (value << 8) | data[i];
        bits += 8;
        while (bits >= 5) {
            output += ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    if (bits > 0) {
        output += ALPHABET[(value << (5 - bits)) & 31];
    }
    return output;
}

export function decodeBase32(input: string): Uint8Array {
    const cleanedInput = input.replace(/=+$/, '').toUpperCase();
    let bits = 0;
    let value = 0;
    let index = 0;
    const output = new Uint8Array(((cleanedInput.length * 5) / 8) | 0);

    for (let i = 0; i < cleanedInput.length; i++) {
        const val = ALPHABET.indexOf(cleanedInput[i]);
        if (val === -1) continue;
        value = (value << 5) | val;
        bits += 5;
        if (bits >= 8) {
            output[index++] = (value >>> (bits - 8)) & 255;
            bits -= 8;
        }
    }
    return output;
}

export function parseAsCompressedJson<T>(validator: (val: unknown) => T | null) {
    return createParser({
        parse(query) {
            if (!query) return null;
            try {
                let decompressed: string | null = null;
                let targetQuery = query;

                // Trick 5: Zero-Server Fallback Handling
                if (query.startsWith('LOCAL-')) {
                    const id = query.substring(6);
                    const localData = localStorage.getItem(`MHR_STATE_${id}`);
                    if (localData) {
                        targetQuery = localData;
                    } else {
                        console.warn("Local state not found. Fallback ID:", id);
                        return null;
                    }
                }
                
                // QR-Optimized Alphanumeric Mode (Base32)
                if (/^[A-Z2-7]+$/.test(targetQuery)) {
                    const uint8Array = decodeBase32(targetQuery);
                    decompressed = LZString.decompressFromUint8Array(uint8Array);
                } 
                
                // Fallback for previous Base64URL-like strings
                if (!decompressed) {
                     decompressed = LZString.decompressFromEncodedURIComponent(targetQuery);
                }

                if (!decompressed) return null;
                const parsed = JSON.parse(decompressed);
                return validator(parsed);
            } catch (e) {
                console.error("Failed to parse compressed JSON state:", e);
                return null;
            }
        },
        serialize(value: T) {
            const jsonString = JSON.stringify(value);
            // Compress into binary array and encode via QR-optimal Base32
            const uint8Array = LZString.compressToUint8Array(jsonString);
            const encoded = encodeBase32(uint8Array);
            
            // Trick 5: Synchronous LocalStorage Fallback
            // If the URL length exceeds ~2000 chars, it cannot fit in a QR code or might hit server limits.
            if (encoded.length > 2000) {
                // Generate a random 9-character alphanumeric ID
                const id = Math.random().toString(36).substring(2, 11).toUpperCase();
                try {
                    localStorage.setItem(`MHR_STATE_${id}`, encoded);
                    return `LOCAL-${id}`;
                } catch (e) {
                    console.error("Failed to save state to localStorage", e);
                    // Fallback to sending the huge URL if localStorage is full/disabled
                    return encoded;
                }
            }
            
            return encoded;
        }
    });
}
