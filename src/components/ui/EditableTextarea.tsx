import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextareaProps {
    value: string;
    onChange?: (val: string) => void;
    className?: string;
    placeholder?: string;
    rows?: number;
    isReadOnly?: boolean;
    onTraitClick?: () => void;
}

export default function EditableTextarea({ 
    value, 
    onChange, 
    className = '', 
    placeholder = '', 
    rows = 1,
    isReadOnly = false,
    onTraitClick
}: EditableTextareaProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            autoResize();
        }
    }, [isEditing]);

    const autoResize = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value && onChange) {
            onChange(tempValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && rows === 1) {
            handleBlur();
        }
        if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (isReadOnly) {
        return (
            <div 
                className={cn(
                    "cursor-pointer hover:bg-black/5 transition-colors p-1 rounded",
                    className
                )}
                onClick={onTraitClick}
            >
                {value || placeholder}
            </div>
        );
    }

    if (isEditing) {
        return (
            <textarea
                ref={textareaRef}
                className={cn(
                    "bg-transparent border-none border-b border-solid border-primary bg-black/5 outline-none w-full p-0 m-0 block resize-none overflow-hidden",
                    className
                )}
                rows={rows}
                value={tempValue}
                onChange={(e) => {
                    setTempValue(e.target.value);
                    autoResize();
                }}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
            />
        );
    }

    return (
        <div 
            className={cn(
                "border-b border-dashed border-transparent hover:border-border-hover cursor-text transition-all duration-200 p-0 m-0",
                className
            )}
            onClick={() => setIsEditing(true)}
        >
            {value || <span className="text-muted-foreground italic">{placeholder}</span>}
        </div>
    );
}
