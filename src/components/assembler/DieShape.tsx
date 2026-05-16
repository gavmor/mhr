import React from 'react';

interface DieShapeProps {
    type: number;
    fill?: string;
    size?: string;
    showLabel?: boolean;
}

export const DieShape: React.FC<DieShapeProps> = ({ type, fill, size = "w-14 h-14", showLabel = true }) => {
    // Renders an SVG shape based on the die type
    const renderShape = () => {
        const stroke = "black";
        const strokeWidth = "6";
        const strokeLinejoin = "round";

        const getLabel = () => showLabel ? `d${type}` : "";

        switch (type) {
            case 4: // Triangle
                return (
                    <svg viewBox="0 0 100 100" className={size} style={{ overflow: 'visible' }}>
                        <polygon points="50,10 95,90 5,90" fill={fill || "#ef4444"} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
                        {showLabel && <text x="50" y="70" textAnchor="middle" fill="white" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>{getLabel()}</text>}
                    </svg>
                );
            case 6: // Square
                return (
                    <svg viewBox="0 0 100 100" className={size} style={{ overflow: 'visible' }}>
                        <rect x="15" y="15" width="70" height="70" rx="8" fill={fill || "#3b82f6"} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
                        {showLabel && <text x="50" y="60" textAnchor="middle" fill="white" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>{getLabel()}</text>}
                    </svg>
                );
            case 8: // Diamond
                return (
                    <svg viewBox="0 0 100 100" className={size} style={{ overflow: 'visible' }}>
                        <polygon points="50,10 90,50 50,90 10,50" fill={fill || "#22c55e"} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
                        {showLabel && <text x="50" y="60" textAnchor="middle" fill="black" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>{getLabel()}</text>}
                    </svg>
                );
            case 10: // Kite (Decahedron profile)
                return (
                    <svg viewBox="0 0 100 100" className={size} style={{ overflow: 'visible' }}>
                        <polygon points="50,10 90,40 50,90 10,40" fill={fill || "#eab308"} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
                        {showLabel && <text x="50" y="55" textAnchor="middle" fill="black" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>{getLabel()}</text>}
                    </svg>
                );
            case 12: // Pentagon
                return (
                    <svg viewBox="0 0 100 100" className={size} style={{ overflow: 'visible' }}>
                        <polygon points="50,10 90,38 75,90 25,90 10,38" fill={fill || "#a855f7"} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin={strokeLinejoin} />
                        {showLabel && <text x="50" y="62" textAnchor="middle" fill="white" className="font-comic-label font-bold text-2xl" style={{ fontFamily: 'Oswald, sans-serif' }}>{getLabel()}</text>}
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
