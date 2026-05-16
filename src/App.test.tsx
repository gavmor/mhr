import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
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
            ...defaultState,
            heroName: "Persisted Hero",
            realName: "Persisted Real Name",
            pp: 10
        };
        (persistence.loadCharacterData as any).mockReturnValue(mockData);

        render(<App />);

        expect(persistence.loadCharacterData).toHaveBeenCalled();
        expect(screen.getByText('Persisted Hero')).toBeInTheDocument();
    });

    it('saves data to localStorage when data changes', async () => {
        vi.useFakeTimers();
        (persistence.loadCharacterData as any).mockReturnValue(null);
        render(<App />);

        const heroNameView = screen.getByText('HERO NAME');
        fireEvent.click(heroNameView);

        const heroNameInput = screen.getByDisplayValue('HERO NAME');
        fireEvent.change(heroNameInput, { target: { value: 'New Hero Name' } });
        fireEvent.blur(heroNameInput);

        expect(persistence.saveCharacterData).not.toHaveBeenCalled();

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

    it('immediately increments XP and copies command when milestone is clicked in play mode', async () => {
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

        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        render(<App />);

        // Click milestone trigger
        const xp3Trigger = screen.getByText('3 XP');
        await act(async () => {
            fireEvent.click(xp3Trigger);
        });

        // a) XP should now be increased
        expect(screen.getByDisplayValue('13')).toBeInTheDocument();

        // b) Clipboard should contain the add xp command
        expect(writeTextMock).toHaveBeenCalledWith('/xp add who:XP Hero number:3');
    });

    it('immediately increments PP and adds die after hinder click in play mode', async () => {
        const mockData = {
            ...defaultState,
            heroName: "Hinder Hero",
            pp: 1,
            distinctions: ["Dist 1", "Dist 2", "Dist 3"]
        };
        (persistence.loadCharacterData as any).mockReturnValue(mockData);
        (persistence.loadMode as any).mockReturnValue('play');

        const writeTextMock = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, {
            clipboard: {
                writeText: writeTextMock,
            },
        });

        render(<App />);

        // Find hinder label
        const hinderTrigger = screen.getAllByText('HINDER (+1 PP)')[0];
        await act(async () => {
            fireEvent.click(hinderTrigger);
        });

        // PP should now be increased
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
        expect(writeTextMock).toHaveBeenCalledWith('/pp add who:Hinder Hero number:1');
    });
});
