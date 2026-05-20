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
                
                // QR-Optimized Alphanumeric Mode (Base32)
                if (/^[A-Z2-7]+$/.test(query)) {
                    const uint8Array = decodeBase32(query);
                    decompressed = LZString.decompressFromUint8Array(uint8Array);
                } 
                
                // Fallback for previous Base64URL-like strings
                if (!decompressed) {
                     decompressed = LZString.decompressFromEncodedURIComponent(query);
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
            return encodeBase32(uint8Array);
        }
    });
}
