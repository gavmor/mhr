import React from 'react';
import { Die } from './Dice';
import { cn } from '@/lib/utils';
import { StepDie } from '@/lib/validation';

const diceTypes: StepDie[] = ['4', '6', '8', '10', '12'];

interface DieIconProps {
    value: StepDie | string;
    onChange?: (val: StepDie) => void;
    className?: string;
    size?: string;
    isReadOnly?: boolean;
    onTraitClick?: () => void;
}

export default function DieIcon({ 
    value, 
    onChange, 
    className = '', 
    size = "w-14 h-14",
    isReadOnly = false,
    onTraitClick
}: DieIconProps) {
    const cycleDie = () => {
        if (isReadOnly) {
            if (onTraitClick) onTraitClick();
            return;
        }
        let currentIndex = diceTypes.indexOf(value as StepDie);
        if (currentIndex === -1) currentIndex = 2; // Default to '8'
        const nextIndex = (currentIndex + 1) % diceTypes.length;
        if (onChange) onChange(diceTypes[nextIndex]);
    };

    return (
        <div 
            className={cn(
                "select-none transition-transform duration-100",
                isReadOnly ? "playable-trait rounded-full" : "cursor-pointer active:scale-90",
                className
            )} 
            onClick={cycleDie}
        >
            <Die type={value} size={size} />
        </div>
    );
}
