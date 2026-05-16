import React from 'react';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ModeSelectorProps {
    mode: 'edit' | 'play';
    onChange: (mode: 'edit' | 'play') => void;
    className?: string;
}

export default function ModeSelector({ mode, onChange, className }: ModeSelectorProps) {
    const isPlay = mode === 'play';
    
    return (
        <div className={cn("flex items-center gap-3 bg-white p-2 border-4 border-black shadow-[4px_4px_0_0_#000]", className)}>
            <Badge 
                variant={isPlay ? "outline" : "default"} 
                className={cn(
                    "font-comic-label text-sm px-3 py-1 border-2 border-black",
                    !isPlay ? "bg-comic-yellow text-black" : "text-gray-400 border-gray-300"
                )}
            >
                EDITING
            </Badge>
            
            <Switch 
                checked={isPlay} 
                onCheckedChange={(checked) => onChange(checked ? 'play' : 'edit')}
            />
            
            <Badge 
                variant={isPlay ? "default" : "outline"} 
                className={cn(
                    "font-comic-label text-sm px-3 py-1 border-2 border-black",
                    isPlay ? "bg-comic-red text-white" : "text-gray-400 border-gray-300"
                )}
            >
                PLAYING
            </Badge>
        </div>
    );
}
