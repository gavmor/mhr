import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Assembler } from './Assembler';
import { PoolDie } from '../../App';

const TestWrapper = () => {
    const [pool, setPool] = useState<Record<string, PoolDie[]>>({
        affil: [], dist: [], ps1: [], ps2: [], spec: [], 
        stress: [], comp: [], asset: [], push: [], sfx: []
    });
    return <Assembler pool={pool} setPool={setPool} />;
};

describe('Assembler', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders all categories', () => {
        render(<TestWrapper />);
        expect(screen.getByText('AFFILIATION')).toBeInTheDocument();
        expect(screen.getByText('DISTINCTION')).toBeInTheDocument();
        expect(screen.getByText('POWER SET 1')).toBeInTheDocument();
    });

    it('adds a d6 when a category is clicked', () => {
        render(<TestWrapper />);
        const categoryPanel = screen.getByText('AFFILIATION').closest('.comic-panel') as HTMLElement;
        
        // Ensure no dice initially
        expect(screen.queryByText('d6')).not.toBeInTheDocument();

        fireEvent.click(categoryPanel);

        // A d6 should appear
        const d6Elements = screen.getAllByText('d6');
        expect(d6Elements.length).toBeGreaterThan(0);
    });

    it('cycles a die when tapped', () => {
        render(<TestWrapper />);
        const categoryPanel = screen.getByText('AFFILIATION').closest('.comic-panel') as HTMLElement;
        
        // Add die
        fireEvent.click(categoryPanel);
        
        // Find the d6 container and click it
        const d6Element = screen.getByText('d6').closest('div')?.parentElement as HTMLElement;
        
        fireEvent.pointerDown(d6Element);
        fireEvent.pointerUp(d6Element);

        // Should cycle to d8
        expect(screen.queryByText('d6')).not.toBeInTheDocument();
        expect(screen.getByText('d8')).toBeInTheDocument();
    });

    it('removes a die when long pressed', () => {
        render(<TestWrapper />);
        const categoryPanel = screen.getByText('AFFILIATION').closest('.comic-panel') as HTMLElement;
        
        // Add die
        fireEvent.click(categoryPanel);
        expect(screen.getByText('d6')).toBeInTheDocument();
        
        const d6Element = screen.getByText('d6').closest('div')?.parentElement as HTMLElement;
        
        fireEvent.pointerDown(d6Element);
        act(() => {
            vi.advanceTimersByTime(500);
        });
        fireEvent.pointerUp(d6Element);

        // Should be removed
        expect(screen.queryByText('d6')).not.toBeInTheDocument();
        
        // Toast should appear
        expect(screen.getByText('Die removed')).toBeInTheDocument();
    });

    it('clears all dice when clear button is clicked', () => {
        render(<TestWrapper />);
        const categoryPanel = screen.getByText('AFFILIATION').closest('.comic-panel') as HTMLElement;
        
        // Add die
        fireEvent.click(categoryPanel);
        expect(screen.getByText('d6')).toBeInTheDocument();
        
        const clearButton = screen.getByText('CLEAR POOL');
        fireEvent.click(clearButton);

        // Should be removed
        expect(screen.queryByText('d6')).not.toBeInTheDocument();
    });

    it('renders labeled dice correctly', () => {
        const poolWithLabels = {
            affil: [{ id: '1', value: 8, label: 'Buddy' }],
            dist: [], ps1: [], ps2: [], spec: [], 
            stress: [], comp: [], asset: [], push: [], sfx: []
        };
        const setPool = vi.fn();
        render(<Assembler pool={poolWithLabels} setPool={setPool} />);
        
        expect(screen.getByText('Buddy')).toBeInTheDocument();
    });
});
