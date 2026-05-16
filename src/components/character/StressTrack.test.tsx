import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StressTrack from './StressTrack';

describe('StressTrack', () => {
    it('renders label', () => {
        render(<StressTrack prefix="P" level={0} onChange={vi.fn()} />);
        expect(screen.getByText('P')).toBeInTheDocument();
    });

    it('renders all stress boxes (d4 to d12)', () => {
        const { container } = render(<StressTrack prefix="P" level={0} onChange={vi.fn()} />);
        const boxes = container.querySelectorAll('.stress-box');
        expect(boxes).toHaveLength(5);
        expect(boxes[0]).toHaveClass('sb-d4');
        expect(boxes[1]).toHaveClass('sb-d6');
        expect(boxes[2]).toHaveClass('sb-d8');
        expect(boxes[3]).toHaveClass('sb-d10');
        expect(boxes[4]).toHaveClass('sb-d12');
    });

    it('highlights boxes up to the current value', () => {
        const { container } = render(<StressTrack prefix="P" level={3} onChange={vi.fn()} />);
        const boxes = container.querySelectorAll('.stress-box');
        
        expect(boxes[0]).toHaveClass('active'); // d4
        expect(boxes[1]).toHaveClass('active'); // d6
        expect(boxes[2]).toHaveClass('active'); // d8
        expect(boxes[3]).not.toHaveClass('active'); // d10
        expect(boxes[4]).not.toHaveClass('active'); // d12
    });

    it('calls onChange when clicking a box', () => {
        const onChange = vi.fn();
        const { container } = render(<StressTrack prefix="P" level={0} onChange={onChange} />);
        
        const boxes = container.querySelectorAll('.stress-box');
        fireEvent.click(boxes[2]); // click d8
        
        expect(onChange).toHaveBeenCalledWith(3);
    });

    it('toggles value to 0 if clicking the currently selected max box', () => {
        const onChange = vi.fn();
        const { container } = render(<StressTrack prefix="P" level={3} onChange={onChange} />);
        
        const boxes = container.querySelectorAll('.stress-box');
        fireEvent.click(boxes[2]); // click d8 again
        
        expect(onChange).toHaveBeenCalledWith(0);
    });
});
