import React from 'react';
import EditableTextarea from '../ui/EditableTextarea';
import { Milestone } from '../../App';

interface MilestonesSectionProps {
    milestones: Milestone[];
    onChange: (milestones: Milestone[]) => void;
}

export default function MilestonesSection({ milestones, onChange }: MilestonesSectionProps) {
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
        onChange(milestones.filter((m: Milestone) => m.id !== id));
    };

    return (
        <div className="flex border-b-4 border-black">
            <div className="side-label bg-white border-r-4 border-black pt-10 px-2 w-10 flex-shrink-0 flex items-center justify-center">Milestones</div>
            <div className="flex-grow bg-white p-6">
                {milestones.map((m: Milestone) => (
                    <div key={m.id} className="milestone mb-6 group relative comic-panel p-4 bg-white">
                        <button 
                            className="absolute -right-3 -top-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 border-2 border-black rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-[2px_2px_0_0_#000]"
                            onClick={() => removeMilestone(m.id)}
                            title="Remove Milestone"
                        >✕</button>
                        <div className="border-b-4 border-black pb-2 mb-4">
                            <input 
                                type="text" 
                                className="editable-input font-comic-title text-3xl font-black text-black tracking-wider w-full" 
                                value={m.name}
                                onChange={(e) => updateMilestone(m.id, { name: e.target.value })}
                                placeholder="MILESTONE NAME" 
                            />
                        </div>
                        <div className="space-y-4 pl-4">
                            <div className="flex items-start">
                                <span className="font-comic-label font-bold text-black text-xl w-16 flex-shrink-0">1 XP</span>
                                <EditableTextarea 
                                    className="text-md text-black w-full" 
                                    placeholder="Trigger 1"
                                    value={m.xp1}
                                    onChange={(val: string) => updateMilestone(m.id, { xp1: val })}
                                />
                            </div>
                            <div className="flex items-start">
                                <span className="font-comic-label font-bold text-black text-xl w-16 flex-shrink-0">3 XP</span>
                                <EditableTextarea 
                                    className="text-md text-black w-full" 
                                    placeholder="Trigger 3"
                                    value={m.xp3}
                                    onChange={(val: string) => updateMilestone(m.id, { xp3: val })}
                                />
                            </div>
                            <div className="flex items-start">
                                <span className="font-comic-label font-bold text-black text-xl w-16 flex-shrink-0">10 XP</span>
                                <EditableTextarea 
                                    className="text-md text-black w-full" 
                                    placeholder="Trigger 10"
                                    value={m.xp10}
                                    onChange={(val: string) => updateMilestone(m.id, { xp10: val })}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className="text-center mt-6">
                    <button 
                        className="btn-comic btn-comic-white btn-comic-md"
                        onClick={addMilestone}
                    >+ ADD MILESTONE</button>
                </div>
            </div>
        </div>
    );
}