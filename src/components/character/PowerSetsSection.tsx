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
        <div className="flex">
            <div className="side-label bg-gray-900 border-r border-gray-800 pt-10">Power Sets</div>
            <div className="flex-grow bg-[#0a1128] p-4 space-y-6">
                {powerSets.map((ps: PowerSet, idx: number) => (
                    <div key={ps.id} className={`power-set relative group ${idx > 0 ? 'mt-6 border-t border-gray-800 pt-6' : ''}`}>
                        <button 
                            className="absolute -left-2 top-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 rounded-full w-6 h-6 flex items-center justify-center z-10"
                            onClick={() => removePowerSet(ps.id)}
                            title="Remove Power Set"
                        >✕</button>
                        
                        <div className="section-header oswald-font uppercase tracking-wider">
                            <input 
                                type="text" 
                                className="editable-input" 
                                value={ps.name} 
                                onChange={(e) => updatePowerSet(ps.id, { ...ps, name: e.target.value })}
                                placeholder="POWER SET NAME" 
                            />
                        </div>

                        {/* Powers List */}
                        <div className="powers-list flex flex-wrap gap-4 pl-4 mb-4">
                            {ps.powers.map((power: Power) => (
                                <div key={power.id} className="flex items-center group relative bg-[#111827] rounded p-1 pr-3 border border-gray-700">
                                    <DieIcon 
                                        value={power.die} 
                                        onChange={(val: string) => updatePowerSet(ps.id, { ...ps, powers: ps.powers.map((p: Power) => p.id === power.id ? { ...p, die: val } : p) })} 
                                    />
                                    <input 
                                        type="text" 
                                        className="editable-input oswald-font text-lg font-bold text-white uppercase ml-2 w-32" 
                                        value={power.name} 
                                        onChange={(e) => updatePowerSet(ps.id, { ...ps, powers: ps.powers.map((p: Power) => p.id === power.id ? { ...p, name: e.target.value } : p) })}
                                        placeholder="Power Name" 
                                    />
                                    <button 
                                        className="absolute -right-2 -top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        onClick={() => updatePowerSet(ps.id, { ...ps, powers: ps.powers.filter((p: Power) => p.id !== power.id) })}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="text-sm text-blue-400 hover:text-blue-300 ml-4 mb-4" 
                            onClick={() => updatePowerSet(ps.id, { ...ps, powers: [...ps.powers, { id: generateId(), die: '8', name: "NEW POWER" }] })}
                        >+ Add Power</button>

                        {/* SFX/Limits List */}
                        <div className="sfx-limit-list space-y-2 pl-4">
                            {ps.sfx.map((sfx: SFX) => (
                                <div key={sfx.id} className="flex group relative pl-4 items-start mb-2">
                                    <select 
                                        className="bg-transparent text-white oswald-font font-bold outline-none mr-2 appearance-none cursor-pointer mt-1 text-lg"
                                        value={sfx.type}
                                        onChange={(e) => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.map((s: SFX) => s.id === sfx.id ? { ...s, type: e.target.value } : s) })}
                                    >
                                        <option value="SFX:" className="bg-gray-800">SFX:</option>
                                        <option value="Limit:" className="bg-gray-800">Limit:</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        className="editable-input font-bold text-white italic w-32 mr-2 mt-1 pt-1" 
                                        value={sfx.name} 
                                        onChange={(e) => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.map((s: SFX) => s.id === sfx.id ? { ...s, name: e.target.value } : s) })}
                                        placeholder="Name." 
                                    />
                                    <EditableTextarea 
                                        className="flex-grow text-gray-300 mt-1 pt-1" 
                                        placeholder="Description of the effect."
                                        value={sfx.desc}
                                        onChange={(val: string) => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.map((s: SFX) => s.id === sfx.id ? { ...s, desc: val } : s) })}
                                    />
                                    <button 
                                        className="ml-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1 pt-1"
                                        onClick={() => updatePowerSet(ps.id, { ...ps, sfx: ps.sfx.filter((s: SFX) => s.id !== sfx.id) })}
                                    >✕</button>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="text-sm text-blue-400 hover:text-blue-300 ml-4 mt-2" 
                            onClick={() => updatePowerSet(ps.id, { ...ps, sfx: [...ps.sfx, { id: generateId(), type: 'SFX:', name: 'Name.', desc: 'Description of the effect.' }] })}
                        >+ Add SFX/Limit</button>
                    </div>
                ))}

                <div className="text-center mt-6">
                    <button 
                        className="px-4 py-2 border border-blue-600 text-blue-400 hover:bg-blue-900 hover:text-white transition-colors rounded uppercase oswald-font tracking-widest font-bold"
                        onClick={addPowerSet}
                    >+ Add Power Set</button>
                </div>
            </div>
        </div>
    );
}