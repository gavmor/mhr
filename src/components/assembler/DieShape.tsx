import React from 'react';

interface DieShapeProps {
    type: number;
}

export const DieShape: React.FC<DieShapeProps> = ({ type }) => {
    // Renders an SVG shape based on the die type
    const renderShape = () => {
        switch (type) {
            case 4: // Triangle
                return (
                    <svg viewBox="0 0 100 100" className="w-14 h-14" style={{ overflow: 'visible' }}>
                        <polygon points="50,10 95,90 5,90" fill="#ef4444" stroke="black" strokeWidth="6" strokeLinejoin="round" />
                        <text x="50" y="70" textAnchor="middle" fill="white" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>d4</text>
                    </svg>
                );
            case 6: // Square
                return (
                    <svg viewBox="0 0 100 100" className="w-14 h-14" style={{ overflow: 'visible' }}>
                        <rect x="15" y="15" width="70" height="70" rx="8" fill="#3b82f6" stroke="black" strokeWidth="6" strokeLinejoin="round" />
                        <text x="50" y="60" textAnchor="middle" fill="white" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>d6</text>
                    </svg>
                );
            case 8: // Diamond
                return (
                    <svg viewBox="0 0 100 100" className="w-14 h-14" style={{ overflow: 'visible' }}>
                        <polygon points="50,10 90,50 50,90 10,50" fill="#22c55e" stroke="black" strokeWidth="6" strokeLinejoin="round" />
                        <text x="50" y="60" textAnchor="middle" fill="black" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>d8</text>
                    </svg>
                );
            case 10: // Kite (Decahedron profile)
                return (
                    <svg viewBox="0 0 100 100" className="w-14 h-14" style={{ overflow: 'visible' }}>
                        <polygon points="50,10 90,40 50,90 10,40" fill="#eab308" stroke="black" strokeWidth="6" strokeLinejoin="round" />
                        <text x="50" y="55" textAnchor="middle" fill="black" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>d10</text>
                    </svg>
                );
            case 12: // Pentagon
                return (
                    <svg viewBox="0 0 100 100" className="w-14 h-14" style={{ overflow: 'visible' }}>
                        <polygon points="50,10 90,38 75,90 25,90 10,38" fill="#a855f7" stroke="black" strokeWidth="6" strokeLinejoin="round" />
                        <text x="50" y="62" textAnchor="middle" fill="white" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>d12</text>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="assembler-die-container animate-pop flex items-center justify-center m-1">
            {renderShape()}
        </div>
    );
};
