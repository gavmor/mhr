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
        <div className="flex border-t-2 border-blue-900">
            <div className="side-label bg-gray-900 border-r border-gray-800 pt-10">Milestones</div>
            <div className="flex-grow bg-[#0a1128] p-6">
                {milestones.map((m: Milestone) => (
                    <div key={m.id} className="milestone mb-6 group relative border border-gray-800 p-4 rounded bg-[#0f172a]">
                        <button 
                            className="absolute right-2 top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center z-10"
                            onClick={() => removeMilestone(m.id)}
                            title="Remove Milestone"
                        >✕</button>
                        <input 
                            type="text" 
                            className="editable-input oswald-font text-2xl font-black text-white uppercase tracking-wider mb-4 w-full" 
                            value={m.name}
                            onChange={(e) => updateMilestone(m.id, { name: e.target.value })}
                            placeholder="MILESTONE NAME" 
                        />
                        <div className="space-y-3 pl-4">
                            <div className="flex items-start">
                                <span className="oswald-font font-bold text-white w-12 flex-shrink-0 mt-1">1 XP</span>
                                <EditableTextarea 
                                    className="text-sm text-gray-300 w-full mt-1" 
                                    placeholder="Trigger 1"
                                    value={m.xp1}
                                    onChange={(val: string) => updateMilestone(m.id, { xp1: val })}
                                />
                            </div>
                            <div className="flex items-start">
                                <span className="oswald-font font-bold text-white w-12 flex-shrink-0 mt-1">3 XP</span>
                                <EditableTextarea 
                                    className="text-sm text-gray-300 w-full mt-1" 
                                    placeholder="Trigger 3"
                                    value={m.xp3}
                                    onChange={(val: string) => updateMilestone(m.id, { xp3: val })}
                                />
                            </div>
                            <div className="flex items-start">
                                <span className="oswald-font font-bold text-white w-12 flex-shrink-0 mt-1">10 XP</span>
                                <EditableTextarea 
                                    className="text-sm text-gray-300 w-full mt-1" 
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
                        className="px-4 py-2 border border-blue-600 text-blue-400 hover:bg-blue-900 hover:text-white transition-colors rounded uppercase oswald-font tracking-widest font-bold"
                        onClick={addMilestone}
                    >+ Add Milestone</button>
                </div>
            </div>
        </div>
    );
}