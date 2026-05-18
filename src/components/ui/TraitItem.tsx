import React from 'react';
import DieIcon from './DieIcon';
import EditableTextarea from './EditableTextarea';
import { StepDie } from '@/lib/validation';

interface TraitItemProps {
    die: StepDie;
    onDieChange?: (val: StepDie) => void;
    name: string;
    onNameChange: (val: string) => void;
    placeholder: string;
    isReadOnly?: boolean;
    onTraitClick?: () => void;
    onRemove?: () => void;
}

export default function TraitItem({
    die,
    onDieChange,
    name,
    onNameChange,
    placeholder,
    isReadOnly = false,
    onTraitClick,
    onRemove,
}: TraitItemProps) {
    return (
        <div className="flex items-center group relative">
            <DieIcon
                value={die}
                onChange={onDieChange}
                isReadOnly={isReadOnly}
                onTraitClick={onTraitClick}
            />
            <EditableTextarea
                className="font-comic-label text-lg font-bold text-black uppercase ml-2 w-32"
                value={name}
                onChange={onNameChange}
                placeholder={placeholder}
                isReadOnly={isReadOnly}
                onTraitClick={onTraitClick}
            />
            {!isReadOnly && onRemove && (
                <button
                    className="absolute -right-4 top-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl font-black no-print"
                    onClick={onRemove}
                >✕</button>
            )}
        </div>
    );
}
