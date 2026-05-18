import React from 'react';
import { Die } from '../ui/Dice';
import { cn } from '@/lib/utils';

interface StressTrackProps {
    prefix: string;
    level: number;
    onChange: (level: number) => void;
    isReadOnly?: boolean;
}

export default function StressTrack({ prefix, level, onChange, isReadOnly = false }: StressTrackProps) {
    const boxes = [1, 2, 3, 4, 5];
    const diceTypes = [4, 6, 8, 10, 12];
    const [fillingLevel, setFillingLevel] = React.useState(level);
    const stepRef = React.useRef(fillingLevel);

    React.useEffect(() => {
        if (level <= fillingLevel) {
            setFillingLevel(level);
            return;
        }

        stepRef.current = fillingLevel;
        const timer = setInterval(() => {
            stepRef.current++;
            setFillingLevel(stepRef.current);
            if (stepRef.current >= level) clearInterval(timer);
        }, 80);
        return () => clearInterval(timer);
    }, [level]);

    const toggleStress = (clickedLevel: number) => {
        if (isReadOnly) return;
        if (level === clickedLevel) {
            onChange(0);
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
                    className={cn(
                        "stress-box",
                        boxLevel <= fillingLevel ? 'active' : '',
                        boxLevel <= fillingLevel && 'animate-stress-fill',
                        !isReadOnly && "cursor-pointer transition-transform duration-100 active:scale-90"
                    )}
                    onClick={() => toggleStress(boxLevel)}
                >
                    <Die 
                        type={diceTypes[i]} 
                        fill={boxLevel <= fillingLevel ? '#ef4444' : '#ffffff'} 
                        size="w-8 h-8"
                        showLabel={false}
                    />
                </div>
            ))}
        </div>
    );
}
