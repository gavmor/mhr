import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveCharacterData, loadCharacterData, clearCharacterData, saveMode, loadMode } from './persistence';
import { CharacterData } from '../App';

const mockData: Partial<CharacterData> = {
    heroName: "Test Hero",
    realName: "Test Real Name",
    pp: 5
};

describe('persistence utility', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('saves character data to localStorage', () => {
        saveCharacterData(mockData as CharacterData);
        const stored = localStorage.getItem('mhr_character_data');
        expect(stored).not.toBeNull();
        expect(JSON.parse(stored!)).toEqual(mockData);
    });

    it('loads character data from localStorage', () => {
        localStorage.setItem('mhr_character_data', JSON.stringify(mockData));
        const loaded = loadCharacterData();
        expect(loaded).toEqual(mockData);
    });

    it('returns null if no data is in localStorage', () => {
        const loaded = loadCharacterData();
        expect(loaded).toBeNull();
    });

    it('clears character data from localStorage', () => {
        localStorage.setItem('mhr_character_data', JSON.stringify(mockData));
        clearCharacterData();
        expect(localStorage.getItem('mhr_character_data')).toBeNull();
    });

    it('handles errors when saving data', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('Quota exceeded');
        });

        saveCharacterData(mockData as CharacterData);
        expect(consoleSpy).toHaveBeenCalled();
        
        setItemSpy.mockRestore();
        consoleSpy.mockRestore();
    });

    it('handles errors when loading data', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            return '{ invalid json';
        });

        const loaded = loadCharacterData();
        expect(loaded).toBeNull();
        expect(consoleSpy).toHaveBeenCalled();
        
        vi.restoreAllMocks();
    });

    it('handles errors when clearing data', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
            throw new Error('Storage error');
        });

        clearCharacterData();
        expect(consoleSpy).toHaveBeenCalled();
        
        vi.restoreAllMocks();
    });

    it('saves and loads application mode', () => {
        saveMode('play');
        expect(localStorage.getItem('mhr_app_mode')).toBe('play');
        expect(loadMode()).toBe('play');

        saveMode('edit');
        expect(loadMode()).toBe('edit');
    });

    it('defaults to edit mode if none is stored', () => {
        expect(loadMode()).toBe('edit');
    });
});
