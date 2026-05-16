import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EditableTextarea from './EditableTextarea';

describe('EditableTextarea', () => {
    it('renders with initial value', () => {
        render(<EditableTextarea value="Test Value" onChange={vi.fn()} />);
        expect(screen.getByDisplayValue('Test Value')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const onChange = vi.fn();
        render(<EditableTextarea value="Test" onChange={onChange} />);
        
        const textarea = screen.getByDisplayValue('Test');
        fireEvent.change(textarea, { target: { value: 'Test Updated' } });
        
        expect(onChange).toHaveBeenCalledWith('Test Updated');
    });

    it('applies custom className', () => {
        render(<EditableTextarea value="Test" onChange={vi.fn()} className="custom-class" />);
        expect(screen.getByDisplayValue('Test')).toHaveClass('custom-class');
        expect(screen.getByDisplayValue('Test')).toHaveClass('editable-input');
    });

    it('adjusts height on mount and change', () => {
        const { container } = render(<EditableTextarea value="Test\nMultiline" onChange={vi.fn()} />);
        const textarea = container.querySelector('textarea');
        expect(textarea?.style.height).not.toBe('');
    });
});
