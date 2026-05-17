import React from 'react';
import EditableTextarea from '../ui/EditableTextarea';
import { Milestone } from '../../App';
import { ComicButton } from '../ui/ComicButton';
import { cn } from '@/lib/utils';

interface MilestonesSectionProps {
    milestones: Milestone[];
    onChange: (milestones: Milestone[]) => void;
    isPlayMode?: boolean;
    onMilestoneClick?: (amount: number) => void;
}

export default function MilestonesSection({ 
    milestones, 
    onChange, 
    isPlayMode = false,
    onMilestoneClick
}: MilestonesSectionProps) {
    const [exitingIds, setExitingIds] = React.useState<Set<string>>(new Set());
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addMilestone = () => {
        onChange([...milestones, {
            id: generateId(),
            name: "MILESTONE NAME",
            xp1: "when you do a minor thing.",
            xp3: "when you do a major thing.",
            xp10: "when you make a character defining choice."
        }]);
    };

    const updateMilestone = (id: string, updates: Partial<Milestone>) => {
        onChange(milestones.map((m: Milestone) => m.id === id ? { ...m, ...updates } : m));
    };

    const removeMilestone = (id: string) => {
        setExitingIds(prev => new Set(prev).add(id));
        setTimeout(() => {
            setExitingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
            onChange(milestones.filter((m: Milestone) => m.id !== id));
        }, 350);
    };

    const handleXPClick = (amount: number) => {
        if (isPlayMode && onMilestoneClick) {
            onMilestoneClick(amount);
        }
    };

    return (
        <div className="flex border-b-4 border-black">
            <div className="side-label bg-white border-r-4 border-black pt-10 px-2 w-10 flex-shrink-0 flex items-center justify-center">Milestones</div>
            <div className="flex-grow bg-white p-6">
                {milestones.map((m: Milestone) => (
                    <div key={m.id} className={cn("milestone mb-6 group relative comic-panel p-4 bg-white", exitingIds.has(m.id) ? "animate-crumple-out" : "animate-pop")}>
                        {!isPlayMode && (
                            <button 
                                className="absolute -right-3 -top-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 border-2 border-black rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-[2px_2px_0_0_#000] no-print"
                                onClick={() => removeMilestone(m.id)}
                                title="Remove Milestone"
                            >✕</button>
                        )}
                        <div className="border-b-4 border-black pb-2 mb-4">
                            <EditableTextarea 
                                className="text-3xl font-black text-black tracking-wider w-full font-comic-title" 
                                value={m.name}
                                onChange={(val) => updateMilestone(m.id, { name: val })}
                                placeholder="MILESTONE NAME" 
                                isReadOnly={isPlayMode}
                            />
                        </div>
                        <div className="space-y-4 pl-4">
                            <div className="flex items-start group/xp">
                                <span 
                                    className={cn(
                                        "font-comic-label font-bold text-black text-xl w-16 flex-shrink-0 select-none",
                                        isPlayMode && "playable-trait rounded px-1"
                                    )}
                                    onClick={() => handleXPClick(1)}
                                >1 XP</span>
                                <EditableTextarea 
                                    className="text-md text-black w-full" 
                                    placeholder="Trigger 1"
                                    value={m.xp1}
                                    onChange={(val: string) => updateMilestone(m.id, { xp1: val })}
                                    isReadOnly={isPlayMode}
                                    onTraitClick={() => handleXPClick(1)}
                                />
                            </div>
                            <div className="flex items-start group/xp">
                                <span 
                                    className={cn(
                                        "font-comic-label font-bold text-black text-xl w-16 flex-shrink-0 select-none",
                                        isPlayMode && "playable-trait rounded px-1"
                                    )}
                                    onClick={() => handleXPClick(3)}
                                >3 XP</span>
                                <EditableTextarea 
                                    className="text-md text-black w-full" 
                                    placeholder="Trigger 3"
                                    value={m.xp3}
                                    onChange={(val: string) => updateMilestone(m.id, { xp3: val })}
                                    isReadOnly={isPlayMode}
                                    onTraitClick={() => handleXPClick(3)}
                                />
                            </div>
                            <div className="flex items-start group/xp">
                                <span 
                                    className={cn(
                                        "font-comic-label font-bold text-black text-xl w-16 flex-shrink-0 select-none",
                                        isPlayMode && "playable-trait rounded px-1"
                                    )}
                                    onClick={() => handleXPClick(10)}
                                >10 XP</span>
                                <EditableTextarea 
                                    className="text-md text-black w-full" 
                                    placeholder="Trigger 10"
                                    value={m.xp10}
                                    onChange={(val: string) => updateMilestone(m.id, { xp10: val })}
                                    isReadOnly={isPlayMode}
                                    onTraitClick={() => handleXPClick(10)}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {!isPlayMode && (
                    <div className="text-center mt-6 no-print">
                        <ComicButton 
                            variant="white" 
                            size="md"
                            onClick={addMilestone}
                        >+ ADD MILESTONE</ComicButton>
                    </div>
                )}
            </div>
        </div>
    );
}
