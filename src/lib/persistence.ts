import { CharacterData } from '../App';

const STORAGE_KEY = 'mhr_character_data';
const MODE_KEY = 'mhr_app_mode';

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

/**
 * Saves the application mode (edit or play) to localStorage.
 */
export function saveMode(mode: 'edit' | 'play'): void {
    try {
        localStorage.setItem(MODE_KEY, mode);
    } catch (error) {
        console.error('Failed to save mode to localStorage:', error);
    }
}

/**
 * Loads the application mode from localStorage.
 * Defaults to 'edit' if not found.
 */
export function loadMode(): 'edit' | 'play' {
    try {
        const stored = localStorage.getItem(MODE_KEY);
        if (stored === 'play' || stored === 'edit') {
            return stored;
        }
        return 'edit';
    } catch (error) {
        console.error('Failed to load mode from localStorage:', error);
        return 'edit';
    }
}
