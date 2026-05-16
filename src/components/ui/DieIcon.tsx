import React from 'react';
import { Die } from './Dice';

const diceTypes = ['4', '6', '8', '10', '12'];

interface DieIconProps {
    value: string;
    onChange?: (val: string) => void;
    className?: string;
    size?: string;
}

export default function DieIcon({ value, onChange, className = '', size = "w-14 h-14" }: DieIconProps) {
    const cycleDie = () => {
        let currentIndex = diceTypes.indexOf(value);
        if (currentIndex === -1) currentIndex = 2; // Default to '8'
        const nextIndex = (currentIndex + 1) % diceTypes.length;
        if (onChange) onChange(diceTypes[nextIndex]);
    };

    return (
        <div 
            className={`cursor-pointer select-none transition-transform duration-100 active:scale-90 ${className}`} 
            onClick={cycleDie}
        >
            <Die type={value} size={size} />
        </div>
    );
}