import { describe, it, expect, vi } from 'vitest';
import { encodeBase32, decodeBase32, parseAsCompressedJson } from './state-parser';
import LZString from 'lz-string';

describe('Base32 Encoding/Decoding', () => {
    it('correctly encodes and decodes a byte array', () => {
        const input = new Uint8Array([1, 2, 3, 255, 128, 42, 0, 99]);
        const encoded = encodeBase32(input);
        
        // Ensure it only contains uppercase Alphanumeric chars
        expect(encoded).toMatch(/^[A-Z2-7]+$/);
        
        const decoded = decodeBase32(encoded);
        expect(decoded).toEqual(input);
    });

    it('handles empty arrays', () => {
        expect(encodeBase32(new Uint8Array([]))).toBe('');
        expect(decodeBase32('')).toEqual(new Uint8Array([]));
    });

    it('ignores padding and invalid characters during decoding', () => {
        const input = new Uint8Array([255, 128]);
        const encoded = encodeBase32(input); // Should be '76AA'
        
        // Add padding '=' and lowercase/invalid chars
        const decoded = decodeBase32(encoded.toLowerCase() + '==189'); 
        expect(decoded).toEqual(input);
    });
});

describe('parseAsCompressedJson', () => {
    const mockValidator = vi.fn((val: any) => {
        if (val && typeof val === 'object' && val.valid) return val;
        return null;
    });

    const parser = parseAsCompressedJson(mockValidator);

    it('serializes data to a Base32 string', () => {
        const data = { valid: true, test: "data" };
        const serialized = parser.serialize(data);
        
        expect(serialized).toMatch(/^[A-Z2-7]+$/);
        
        // Verify it matches manual LZString + Base32
        const expectedJson = JSON.stringify(data);
        const expectedBytes = LZString.compressToUint8Array(expectedJson);
        const expectedBase32 = encodeBase32(expectedBytes);
        
        expect(serialized).toBe(expectedBase32);
    });

    it('parses valid Base32 compressed data', () => {
        const data = { valid: true, test: "data" };
        const serialized = parser.serialize(data);
        
        const parsed = parser.parse(serialized);
        expect(mockValidator).toHaveBeenCalledWith({ valid: true, test: "data" });
        expect(parsed).toEqual(data);
    });

    it('falls back to old URI encoded format', () => {
        const data = { valid: true, test: "old_format" };
        const oldSerialized = LZString.compressToEncodedURIComponent(JSON.stringify(data));
        
        const parsed = parser.parse(oldSerialized);
        expect(parsed).toEqual(data);
    });

    it('returns null for empty queries', () => {
        expect(parser.parse('')).toBeNull();
    });

    it('returns null for invalid compressed data', () => {
        expect(parser.parse('INVALID_DATA')).toBeNull();
    });

    it('returns null if validator rejects the data', () => {
        const invalidData = { invalid: true };
        const serialized = parser.serialize(invalidData as any);
        
        const parsed = parser.parse(serialized);
        expect(parsed).toBeNull();
    });
});
