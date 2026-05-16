import React, { useRef } from 'react';
import { DieShape } from './DieShape';

interface InteractiveDieProps {
    type: number;
    categoryId: string;
    dieIndex: number;
    onCycle: (categoryId: string, dieIndex: number) => void;
    onRemove: (categoryId: string, dieIndex: number) => void;
}

export const InteractiveDie: React.FC<InteractiveDieProps> = ({ type, categoryId, dieIndex, onCycle, onRemove }) => {
    const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isLongPress = useRef(false);
    const isCancelled = useRef(false);

    const startPress = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Prevent category click
        isLongPress.current = false;
        isCancelled.current = false;
        pressTimer.current = setTimeout(() => {
            if (isCancelled.current) return;
            isLongPress.current = true;
            onRemove(categoryId, dieIndex);
        }, 500); // 500ms long press to delete
    };

    const endPress = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (pressTimer.current) clearTimeout(pressTimer.current);

        // If it wasn't a long press and wasn't cancelled, it's a standard tap to cycle
        if (!isLongPress.current && !isCancelled.current) {
            onCycle(categoryId, dieIndex);
        }
    };

    const cancelPress = (e: React.PointerEvent<HTMLDivElement>) => {
        e.stopPropagation();
        isCancelled.current = true;
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    return (
        <div
            onPointerDown={startPress}
            onPointerUp={endPress}
            onPointerLeave={cancelPress}
            onContextMenu={(e) => { e.preventDefault(); return false; }} // Prevent native context menu on long press
        >
            <DieShape type={type} />
        </div>
    );
};
