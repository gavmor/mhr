import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DieShape } from './DieShape';

describe('DieShape', () => {
    it('renders a d4 correctly', () => {
        render(<DieShape type={4} />);
        expect(screen.getByText('d4')).toBeInTheDocument();
    });

    it('renders a d6 correctly', () => {
        render(<DieShape type={6} />);
        expect(screen.getByText('d6')).toBeInTheDocument();
    });

    it('renders a d8 correctly', () => {
        render(<DieShape type={8} />);
        expect(screen.getByText('d8')).toBeInTheDocument();
    });

    it('renders a d10 correctly', () => {
        render(<DieShape type={10} />);
        expect(screen.getByText('d10')).toBeInTheDocument();
    });

    it('renders a d12 correctly', () => {
        render(<DieShape type={12} />);
        expect(screen.getByText('d12')).toBeInTheDocument();
    });

    it('returns null for an invalid die type', () => {
        const { container } = render(<DieShape type={20} />);
        expect(container.firstChild?.firstChild).toBeNull();
    });
});
