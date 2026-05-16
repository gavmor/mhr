import React, { useState } from 'react';
import HeaderSection from './components/character/HeaderSection';
import PowerSetsSection from './components/character/PowerSetsSection';
import SpecsSection from './components/character/SpecsSection';
import MilestonesSection from './components/character/MilestonesSection';
import JsonModal from './components/JsonModal';
import { Assembler } from './components/assembler/Assembler';

export interface Power {
    id: string;
    die: string;
    name: string;
}

export interface SFX {
    id: string;
    type: string;
    name: string;
    desc: string;
}

export interface PowerSet {
    id: string;
    name: string;
    powers: Power[];
    sfx: SFX[];
}

export interface Specialty {
    id: string;
    die: string;
    name: string;
}

export interface Milestone {
    id: string;
    name: string;
    xp1: string;
    xp3: string;
    xp10: string;
}

export interface CharacterData {
    heroName: string;
    realName: string;
    identityStatus: string;
    portrait: string | null;
    affiliations: string[];
    distinctions: string[];
    xp: number;
    pp: number;
    stress: { p: number; m: number; e: number };
    powerSets: PowerSet[];
    specialties: Specialty[];
    milestones: Milestone[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultState: CharacterData = {
    heroName: "HERO NAME",
    realName: "Real Name",
    identityStatus: "secret",
    portrait: null,
    affiliations: ['8', '6', '10'],
    distinctions: ["DISTINCTION 1", "DISTINCTION 2", "DISTINCTION 3"],
    xp: 0,
    pp: 1,
    stress: { p: 0, m: 0, e: 0 },
    powerSets: [
        {
            id: generateId(),
            name: "NEW POWER SET",
            powers: [{ id: generateId(), die: "8", name: "NEW POWER" }],
            sfx: [
                { id: generateId(), type: "SFX:", name: "Name.", desc: "Description of the effect." },
                { id: generateId(), type: "SFX:", name: "Name.", desc: "Description of the effect." }
            ]
        }
    ],
    specialties: [
        { id: generateId(), die: "8", name: "NEW SPECIALTY" },
        { id: generateId(), die: "8", name: "NEW SPECIALTY" }
    ],
    milestones: [
        {
            id: generateId(),
            name: "MILESTONE NAME",
            xp1: "when you do a minor thing.",
            xp3: "when you do a major thing.",
            xp10: "when you make a character defining choice."
        }
    ]
};

function App() {
    const [activeTab, setActiveTab] = useState<'character' | 'assembler'>('character');
    const [data, setData] = useState<CharacterData>(defaultState);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

    const updateData = (updates: Partial<CharacterData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    return (
        <div className="min-h-screen pb-10 bg-white">
            <div className="p-4 border-4 border-black flex flex-wrap justify-center gap-4 mb-6 bg-comic-cyan comic-panel mx-4 mt-4 max-w-[1000px] md:mx-auto">
                <button
                    className={`px-6 py-2 font-comic-title text-2xl tracking-widest border-4 border-black transition-all ${activeTab === 'character' ? 'bg-comic-red text-white shadow-comic-active translate-y-1 translate-x-1' : 'bg-white text-black shadow-comic hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('character')}
                >
                    DATAFILE
                </button>
                <button
                    className={`px-6 py-2 font-comic-title text-2xl tracking-widest border-4 border-black transition-all ${activeTab === 'assembler' ? 'bg-comic-red text-white shadow-comic-active translate-y-1 translate-x-1' : 'bg-white text-black shadow-comic hover:bg-gray-100'}`}
                    onClick={() => setActiveTab('assembler')}
                >
                    DICE POOL ASSEMBLER
                </button>
            </div>

            {activeTab === 'character' ? (
                <div className="datafile-container mx-auto mb-10">
                    <HeaderSection data={data} updateData={updateData} />
                    <PowerSetsSection powerSets={data.powerSets} onChange={(ps: PowerSet[]) => updateData({ powerSets: ps })} />
                    <SpecsSection specialties={data.specialties} onChange={(sp: Specialty[]) => updateData({ specialties: sp })} />
                    <MilestonesSection milestones={data.milestones} onChange={(m: Milestone[]) => updateData({ milestones: m })} />

                    <div className="bg-white p-4 border-t-4 border-black flex flex-wrap justify-end gap-4">
                        <button 
                            className="px-6 py-2 bg-comic-blue hover:bg-blue-300 text-black border-4 border-black shadow-comic active:translate-y-1 active:translate-x-1 active:shadow-comic-active transition-all font-comic-title text-xl tracking-widest"
                            onClick={() => setIsJsonModalOpen(true)}
                        >IMPORT / EXPORT</button>
                        <button 
                            className="px-6 py-2 bg-comic-green hover:bg-green-400 text-black border-4 border-black shadow-comic active:translate-y-1 active:translate-x-1 active:shadow-comic-active transition-all font-comic-title text-xl tracking-widest"
                            onClick={() => window.print()}
                        >PRINT PDF</button>
                    </div>

                    <JsonModal 
                        isOpen={isJsonModalOpen} 
                        onClose={() => setIsJsonModalOpen(false)} 
                        data={data}
                        onImport={(importedData: any) => {
                            // Ensure IDs exist on imported data to prevent key errors
                            const processedData = { ...defaultState, ...importedData };
                            if (processedData.powerSets) {
                                processedData.powerSets.forEach((ps: PowerSet) => {
                                    if (!ps.id) ps.id = generateId();
                                    if (ps.powers) ps.powers.forEach((p: Power) => { if (!p.id) p.id = generateId(); });
                                    if (ps.sfx) ps.sfx.forEach((s: SFX) => { if (!s.id) s.id = generateId(); });
                                });
                            }
                            if (processedData.specialties) {
                                processedData.specialties.forEach((sp: Specialty) => { if (!sp.id) sp.id = generateId(); });
                            }
                            if (processedData.milestones) {
                                processedData.milestones.forEach((m: Milestone) => { if (!m.id) m.id = generateId(); });
                            }
                            setData(processedData);
                        }}
                    />
                </div>
            ) : (
                <Assembler />
            )}
        </div>
    );
}

export default App;