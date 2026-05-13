import React from 'react';

interface StressTrackProps {
    prefix: string;
    level: number;
    onChange: (level: number) => void;
}

export default function StressTrack({ prefix, level, onChange }: StressTrackProps) {
    const boxes = [1, 2, 3, 4, 5];
    const shapes = ['sb-d4', 'sb-d6', 'sb-d8', 'sb-d10', 'sb-d12'];

    const toggleStress = (clickedLevel: number) => {
        if (level === clickedLevel) {
            onChange(0); // clear if clicking the current max level
        } else {
            onChange(clickedLevel);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <span className="oswald-font font-bold text-white w-4">{prefix}</span>
            {boxes.map((boxLevel, i) => (
                <div 
                    key={boxLevel}
                    className={`stress-box ${shapes[i]} ${boxLevel <= level ? 'active' : ''}`}
                    onClick={() => toggleStress(boxLevel)}
                    style={shapes[i] === 'sb-d12' ? { borderRadius: '50%' } : {}}
                ></div>
            ))}
        </div>
    );
}