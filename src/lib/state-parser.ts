import { createParser } from 'nuqs';
import LZString from 'lz-string';

export function parseAsCompressedJson<T>(validator: (val: unknown) => T | null) {
    return createParser({
        parse(query) {
            if (!query) return null;
            try {
                const decompressed = LZString.decompressFromEncodedURIComponent(query);
                if (!decompressed) return null;
                const parsed = JSON.parse(decompressed);
                return validator(parsed);
            } catch (e) {
                console.error("Failed to parse compressed JSON state:", e);
                return null;
            }
        },
        serialize(value: T) {
            return LZString.compressToEncodedURIComponent(JSON.stringify(value));
        }
    });
}
