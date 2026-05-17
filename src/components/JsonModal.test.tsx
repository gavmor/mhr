import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JsonModal from './JsonModal';
import { defaultState } from '../App';

describe('JsonModal Validation', () => {
    it('successfully calls onImport with valid character data', () => {
        const handleImport = vi.fn();
        render(<JsonModal isOpen={true} onClose={() => {}} data={defaultState} onImport={handleImport} />);

        const textarea = screen.getByRole('textbox');
        const loadButton = screen.getByText('Load Data');

        fireEvent.change(textarea, { target: { value: JSON.stringify(defaultState) } });
        fireEvent.click(loadButton);

        expect(handleImport).toHaveBeenCalledTimes(1);
    });

    it('does not call onImport and shows detailed Zod errors for invalid schema data', () => {
        const handleImport = vi.fn();
        render(<JsonModal isOpen={true} onClose={() => {}} data={defaultState} onImport={handleImport} />);

        const textarea = screen.getByRole('textbox');
        const loadButton = screen.getByText('Load Data');

        const invalidData = { ...defaultState, xp: -5, someExtraField: "foo" };

        fireEvent.change(textarea, { target: { value: JSON.stringify(invalidData) } });
        fireEvent.click(loadButton);

        expect(handleImport).not.toHaveBeenCalled();
        
        // Detailed error UI should be present
        expect(screen.getByText(/Validation Error/i)).toBeInTheDocument();
        expect(screen.getByText(/xp: Too small: expected number to be >=0/i)).toBeInTheDocument();
        expect(screen.getByText(/Unrecognized key: "someExtraField"/i)).toBeInTheDocument();
    });
});
