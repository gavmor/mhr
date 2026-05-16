import React from 'react';
import DieIcon from '../ui/DieIcon';
import EditableTextarea from '../ui/EditableTextarea';
import { PowerSet, Power, SFX } from '../../App';

interface PowerSetsSectionProps {
    powerSets: PowerSet[];
    onChange: (powerSets: PowerSet[]) => void;
}

export default function PowerSetsSection({ powerSets, onChange }: PowerSetsSectionProps) {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const updatePowerSet = (id: string, newSet: PowerSet) => {
        onChange(powerSets.map((ps: PowerSet) => ps.id === id ? newSet : ps));
    };

    const addPowerSet = () => {
        onChange([...powerSets, {
            id: generateId(),
            name: "NEW POWER SET",
            powers: [],
            sfx: []
        }]);
    };

    const removePowerSet = (id: string) => {
        onChange(powerSets.filter((ps: PowerSet) => ps.id !== id));
    };

    return (
        <div className="flex border-b-4 border-black">
            <div className="side-label bg-white border-r-4 border-black pt-10 px-2 w-10 flex-shrink-0 flex items-center justify-center">Power Sets</div>
            <div className="flex-grow bg-white p-4 space-y-6">
                {powerSets.map((ps: PowerSet, idx: number) => (
                    <div key={ps.id} className={`comic-panel p-4 relative group ${idx % 2 === 0 ? 'bg-comic-orange' : 'bg-comic-orange-light'}`}>
                        <button 
                            className="absolute -right-3 -top-3 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 border-2 border-black rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-[2px_2px_0_0_#000]"
                            onClick={() => removePowerSet(ps.id)}
                            title="Remove Power Set"
                        >✕</button>
                        
                        <div className="font-comic-label font-bold text-xl uppercase tracking-wider mb-2 border-b-2 border-black/20 pb-1">
                            <input 
                                type="text" 
                                className="editable-input text-black w-full" 
                                value={ps.name} 
                                onChange={(e) => updatePowerSet(ps.id, { ...ps, name: e.target.value })}
                                placeholder="POWER SET NAME" 
                            />
                        </div>

                        {/* Powers List */}
                        <div className="powers-list flex flex-wrap gap-4 mb-4 mt-2">
                            {ps.powers.map((power: Power) => (
                                <div key={power.id} className="flex items-center group relative p-1 pr-3">
                                    <DieIcon 
                                        value={power.die} 
                                        onChange={(val: string) => updatePowerSet(ps.id, { ...ps, powers: ps.powers.map((p: Power) => p.id === power.id ? { ...p, die: val } : p) })} 
                                    />
                                    <input 
                                        type="text" 
                                        className="editable-input font-comic-label text-lg font-bold text-black uppercase ml-2 w-32" 
                                        value={power.name} 
                                        onChange={(e) => updatePowerSet(ps.id, { ...ps, powers: ps.powers.map((p: Power) => p.id === power.id ? { ...p, name: e.target.value } : p) })}
                                        placeholder="Power Name" 
                                    />
                                    <button 
                                        className="absolute -right-2 -top-2 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 border-2 border-black rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                        onClick={() => updatePowerSet(ps.id, { ...ps, powers: ps.powers.filter((p: Power) => p.id !== power.id) })}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="text-sm text-black font-bold font-comic-label hover:underline mb-4" 
                            onClick={() => updatePowerSet(ps.id, { ...ps, powers: [...ps.powers, { id: generateId(), die: '8', name: "NEW POWER" }] })}
                        >+ Add Power</button>

                        {/* SFX/Limits List */}
                        <div className="sfx-limit-list space-y-2 mt-2">
                            {ps.sfx.map((sfx: SFX) => (
                                <div key={sfx.id} className="flex group relative items-start bg-white/50 p-2 border-2 border-black/10">
                                    <select 
                                        className="bg-transparent text-black font-comic-label font-bold outline-none mr-2 appearance-none cursor-pointer mt-1 text-lg uppercase"
                                        value={sfx.type}
                                        onChange={(e) => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.map((s: SFX) => s.id === sfx.id ? { ...s, type: e.target.value } : s) })}
                                    >
                                        <option value="SFX:" className="bg-comic-orange">SFX:</option>
                                        <option value="Limit:" className="bg-comic-orange">Limit:</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        className="editable-input font-bold text-black italic w-32 mr-2 mt-1 pt-1" 
                                        value={sfx.name} 
                                        onChange={(e) => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.map((s: SFX) => s.id === sfx.id ? { ...s, name: e.target.value } : s) })}
                                        placeholder="Name." 
                                    />
                                    <EditableTextarea 
                                        className="flex-grow text-black mt-1 pt-1" 
                                        placeholder="Description of the effect."
                                        value={sfx.desc}
                                        onChange={(val: string) => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.map((s: SFX) => s.id === sfx.id ? { ...s, desc: val } : s) })}
                                    />
                                    <button 
                                        className="ml-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1 pt-1 font-bold"
                                        onClick={() => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.filter((s: SFX) => s.id !== sfx.id) })}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="text-sm text-black font-bold font-comic-label hover:underline mt-2" 
                            onClick={() => updatePowerSet(ps.id, { ...ps, sfx: [...ps.sfx, { id: generateId(), type: 'SFX:', name: 'Name.', desc: 'Description of the effect.' }] })}
                        >+ Add SFX/Limit</button>
                    </div>
                ))}

                <div className="text-center mt-6">
                    <button 
                        className="px-6 py-2 bg-white text-black border-4 border-black shadow-comic active:translate-y-1 active:translate-x-1 active:shadow-comic-active hover:bg-gray-100 transition-all font-comic-title text-xl tracking-widest"
                        onClick={addPowerSet}
                    >+ ADD POWER SET</button>
                </div>
            </div>
        </div>
    );
}