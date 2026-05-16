import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DieIcon from './DieIcon';

describe('DieIcon', () => {
    it('renders correctly with given value', () => {
        render(<DieIcon value="8" onChange={vi.fn()} />);
        expect(screen.getByText('8')).toBeInTheDocument();
        expect(screen.getByText('8')).toHaveClass('die-d8');
    });

    it('defaults to d8 if value is empty or invalid when cycling', () => {
        const onChange = vi.fn();
        const { container, rerender } = render(<DieIcon value="" onChange={onChange} />);
        
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onChange).toHaveBeenCalledWith('10'); // Because default is index 2 ('8'), next is index 3 ('10')
        
        onChange.mockClear();
        rerender(<DieIcon value="invalid" onChange={onChange} />);
        fireEvent.click(container.firstChild as HTMLElement);
        expect(onChange).toHaveBeenCalledWith('10');
    });

    it('renders different die types', () => {
        const { rerender } = render(<DieIcon value="4" onChange={vi.fn()} />);
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('4')).toHaveClass('die-d4');

        rerender(<DieIcon value="6" onChange={vi.fn()} />);
        expect(screen.getByText('6')).toBeInTheDocument();

        rerender(<DieIcon value="10" onChange={vi.fn()} />);
        expect(screen.getByText('10')).toBeInTheDocument();

        rerender(<DieIcon value="12" onChange={vi.fn()} />);
        expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('calls onChange when clicked', () => {
        const onChange = vi.fn();
        render(<DieIcon value="8" onChange={onChange} />);
        
        fireEvent.click(screen.getByText('8'));
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
