import { CharacterData } from '../App';

const STORAGE_KEY = 'mhr_character_data';

/**
 * Saves character data to localStorage.
 */
export function saveCharacterData(data: CharacterData): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save character data to localStorage:', error);
    }
}

/**
 * Loads character data from localStorage.
 */
export function loadCharacterData(): CharacterData | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as CharacterData;
    } catch (error) {
        console.error('Failed to load character data from localStorage:', error);
        return null;
    }
}

/**
 * Clears character data from localStorage.
 */
export function clearCharacterData(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear character data from localStorage:', error);
    }
}
