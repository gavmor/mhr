import { describe, it, expect } from 'vitest';
import { generateRollCommand } from './cortexPal';
import { PoolDie } from '../App';

describe('cortexPal utility', () => {
    it('generates an empty string for an empty pool', () => {
        expect(generateRollCommand({})).toBe('');
    });

    it('generates a simple roll command for unlabeled dice', () => {
        const pool: Record<string, PoolDie[]> = {
            affil: [{ id: '1', value: 8 }, { id: '2', value: 6 }]
        };
        expect(generateRollCommand(pool)).toBe('/roll dice:d8 d6');
    });

    it('generates a command with labeled dice', () => {
        const pool: Record<string, PoolDie[]> = {
            affil: [{ id: '1', value: 10, label: 'Solo' }],
            dist: [{ id: '2', value: 8, label: 'Heroic' }]
        };
        expect(generateRollCommand(pool)).toBe('/roll dice:d10 Solo d8 Heroic');
    });

    it('combines dice from multiple categories', () => {
        const pool: Record<string, PoolDie[]> = {
            affil: [{ id: '1', value: 10, label: 'Team' }],
            ps1: [{ id: '2', value: 8, label: 'Super Strength' }],
            spec: [{ id: '3', value: 10, label: 'Combat Master' }]
        };
        expect(generateRollCommand(pool)).toBe('/roll dice:d10 Team d8 Super Strength d10 Combat Master');
    });

    it('trims labels', () => {
        const pool: Record<string, PoolDie[]> = {
            affil: [{ id: '1', value: 8, label: '  Buddy  ' }]
        };
        expect(generateRollCommand(pool)).toBe('/roll dice:d8 Buddy');
    });
});
