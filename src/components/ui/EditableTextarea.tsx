import React, { useRef, useEffect } from 'react';

interface EditableTextareaProps {
    value: string;
    onChange?: (val: string) => void;
    className?: string;
    placeholder?: string;
    rows?: number;
}

export default function EditableTextarea({ value, onChange, className = '', placeholder = '', rows = 1 }: EditableTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const autoResize = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }
    };

    useEffect(() => {
        autoResize();
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            rows={rows}
            className={`editable-input ${className}`}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
                if (onChange) onChange(e.target.value);
                autoResize();
            }}
        />
    );
}