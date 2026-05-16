import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App, { defaultState } from './App';
import * as persistence from './lib/persistence';

vi.mock('./lib/persistence', () => ({
    loadCharacterData: vi.fn(),
    saveCharacterData: vi.fn(),
    clearCharacterData: vi.fn(),
    loadMode: vi.fn(() => 'edit'),
    saveMode: vi.fn()
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
        // Check for text content since it's in view mode
        expect(screen.getByText('Persisted Hero')).toBeInTheDocument();
    });

    it('saves data to localStorage when data changes', async () => {
        vi.useFakeTimers();
        (persistence.loadCharacterData as any).mockReturnValue(null);
        render(<App />);

        // Click to enter edit mode
        const heroNameView = screen.getByText('HERO NAME');
        fireEvent.click(heroNameView);

        const heroNameInput = screen.getByDisplayValue('HERO NAME');
        
        fireEvent.change(heroNameInput, { target: { value: 'New Hero Name' } });

        // Blur to save
        fireEvent.blur(heroNameInput);

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

    it('resets data when RESET DATA button is clicked', async () => {
        const modifiedState = {
            ...defaultState,
            heroName: "Modified Hero",
            pp: 5
        };
        (persistence.loadCharacterData as any).mockReturnValue(modifiedState);
        
        render(<App />);
        
        const resetButton = screen.getByText('RESET DATA');
        
        fireEvent.click(resetButton);
        
        expect(persistence.clearCharacterData).toHaveBeenCalled();
        expect(screen.getByText('HERO NAME')).toBeInTheDocument();
    });
});

describe('App game interactions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('increments XP and copies command when milestone is clicked in play mode', async () => {
        // Setup mock character with a milestone
        const mockData = {
            ...defaultState,
            heroName: "XP Hero",
            xp: 10,
            milestones: [{
                id: 'm1',
                name: 'Test Milestone',
                xp1: 'trigger 1',
                xp3: 'trigger 3',
                xp10: 'trigger 10'
            }]
        };
        (persistence.loadCharacterData as any).mockReturnValue(mockData);
        (persistence.loadMode as any).mockReturnValue('play');

        // Mock clipboard
        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        render(<App />);

        // Find the 3 XP label
        const xp3Trigger = screen.getByText('3 XP');
        fireEvent.click(xp3Trigger);

        // a) XP should increase from 10 to 13
        // The XP input is an input field
        expect(screen.getByDisplayValue('13')).toBeInTheDocument();

        // b) Clipboard should contain the add xp command
        expect(writeTextMock).toHaveBeenCalledWith('/xp add who:XP Hero number:3');
    });
});
