import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRCodeUrl } from './QRCodeUrl';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { QRCodeSVG } from 'qrcode.react';

// Mock QRCodeSVG to simulate crashing if URL is too long
vi.mock('qrcode.react', () => ({
  QRCodeSVG: vi.fn(({ value }) => {
    if (value.length > 100) {
      throw new Error('Data too long for QR Code');
    }
    return <div data-testid="mock-qr-code">{value}</div>;
  })
}));

describe('QRCodeUrl Component', () => {
    const originalHref = window.location.href;

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset location before each test
        Object.defineProperty(window, 'location', {
            value: { href: 'http://localhost/?DATAFILE=VALID_DATA' },
            writable: true
        });
        
        // Suppress expected console.errors from ErrorBoundary
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('renders the QR Code with the current URL', () => {
        render(<QRCodeUrl />);
        
        expect(screen.getByTestId('mock-qr-code')).toHaveTextContent('http://localhost/?DATAFILE=VALID_DATA');
    });

    it('expands and contracts when clicked', () => {
        render(<QRCodeUrl />);
        
        const container = screen.getByTitle('Click to expand/contract QR code');
        expect(container.className).toContain('w-8'); // Tiny state
        
        fireEvent.click(container);
        
        expect(container.className).toContain('w-64'); // Expanded state
        
        fireEvent.click(container);
        
        expect(container.className).toContain('w-8'); // Back to tiny state
    });

    it('updates URL when popstate event fires', () => {
        render(<QRCodeUrl />);
        
        expect(screen.getByTestId('mock-qr-code')).toHaveTextContent('http://localhost/?DATAFILE=VALID_DATA');
        
        // Change URL and trigger popstate
        window.location.href = 'http://localhost/?DATAFILE=NEW_DATA';
        act(() => {
            window.dispatchEvent(new Event('popstate'));
        });
        
        expect(screen.getByTestId('mock-qr-code')).toHaveTextContent('http://localhost/?DATAFILE=NEW_DATA');
    });

    it('gracefully handles oversized URLs via ErrorBoundary', () => {
        // Feed it an artificially massive URL
        window.location.href = 'http://localhost/?DATAFILE=' + 'A'.repeat(150);
        
        render(<QRCodeUrl />);
        
        // QR Code should crash and ErrorBoundary should catch it and render the fallback
        expect(screen.queryByTestId('mock-qr-code')).not.toBeInTheDocument();
        
        // The fallback UI (AlertCircle icon) should be visible instead of a blank screen
        const container = screen.getByTitle('Click to expand/contract QR code');
        expect(container).toBeInTheDocument();
        
        // Expand it to see the text
        fireEvent.click(container);
        expect(screen.getByText('Data Too Large For QR')).toBeInTheDocument();
    });
});
