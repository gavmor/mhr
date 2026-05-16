import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as persistence from './lib/persistence';

vi.mock('./lib/persistence', () => ({
    loadCharacterData: vi.fn(),
    saveCharacterData: vi.fn(),
    clearCharacterData: vi.fn()
}));

describe('App persistence integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads data from localStorage on mount', () => {
        const mockData = {
            heroName: "Persisted Hero",
            realName: "Persisted Real Name",
            pp: 10,
            affiliations: ['8', '6', '10'],
            distinctions: ["D1", "D2", "D3"],
            stress: { p: 0, m: 0, e: 0 },
            powerSets: [],
            specialties: [],
            milestones: []
        };
        (persistence.loadCharacterData as any).mockReturnValue(mockData);

        render(<App />);

        expect(persistence.loadCharacterData).toHaveBeenCalled();
        // Since input is in HeaderSection, we check for value
        expect(screen.getByDisplayValue('Persisted Hero')).toBeInTheDocument();
    });

    it('saves data to localStorage when data changes', async () => {
        vi.useFakeTimers();
        (persistence.loadCharacterData as any).mockReturnValue(null);
        render(<App />);

        const heroNameInput = screen.getByDisplayValue('HERO NAME');
        
        fireEvent.change(heroNameInput, { target: { value: 'New Hero Name' } });

        // saveCharacterData should not be called yet due to debounce
        expect(persistence.saveCharacterData).not.toHaveBeenCalled();

        // Advance timers by 1s
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(persistence.saveCharacterData).toHaveBeenCalledWith(expect.objectContaining({
            heroName: 'New Hero Name'
        }));
        
        vi.useRealTimers();
    });
});
