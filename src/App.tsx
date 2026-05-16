import React, { useState, useEffect } from 'react';
import HeaderSection from './components/character/HeaderSection';
import PowerSetsSection from './components/character/PowerSetsSection';
import SpecsSection from './components/character/SpecsSection';
import MilestonesSection from './components/character/MilestonesSection';
import JsonModal from './components/JsonModal';
import { Assembler } from './components/assembler/Assembler';
import { loadCharacterData, saveCharacterData, clearCharacterData, loadMode, saveMode } from './lib/persistence';
import { cn } from './lib/utils';

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

export const defaultState: CharacterData = {
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
    const [appMode, setAppMode] = useState<'edit' | 'play'>('edit');
    const [data, setData] = useState<CharacterData>(defaultState);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

    // Load data and mode on mount
    useEffect(() => {
        const persistedData = loadCharacterData();
        if (persistedData) {
            setData(persistedData);
        }
        setAppMode(loadMode());
    }, []);

    // Save mode on change
    useEffect(() => {
        saveMode(appMode);
    }, [appMode]);

    // Save data on change (debounced)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveCharacterData(data);
        }, 1000); // 1s debounce
        return () => clearTimeout(timeoutId);
    }, [data]);

    const updateData = (updates: Partial<CharacterData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const handleReset = () => {
        clearCharacterData();
        setData(defaultState);
    };

    const isPlayMode = appMode === 'play';

    return (
        <div className="min-h-screen pb-10 bg-white">
            {/* Titlebar */}
            <div className="bg-black py-3 px-6 flex justify-center md:justify-start items-baseline gap-3 border-b-4 border-red-600 shadow-md">
                <span className="font-comic-label font-black text-white text-4xl tracking-tighter">MARVEL</span>
                <span className="font-comic-label font-black text-white text-2xl tracking-tighter">HEROIC</span>
                <span className="font-comic-label font-black text-white text-sm tracking-widest pb-1">ROLEPLAYING</span>
            </div>

            <div className="p-4 border-4 border-black flex flex-wrap justify-center gap-4 mb-6 bg-comic-cyan comic-panel mx-4 mt-4 lg:hidden">
                <button
                    className={cn(
                        "btn-comic btn-comic-lg",
                        activeTab === 'character' ? "btn-comic-red" : "btn-comic-white"
                    )}
                    onClick={() => setActiveTab('character')}
                >
                    DATAFILE
                </button>
                <button
                    className={cn(
                        "btn-comic btn-comic-lg",
                        activeTab === 'assembler' ? "btn-comic-red" : "btn-comic-white"
                    )}
                    onClick={() => setActiveTab('assembler')}
                >
                    DICE POOL ASSEMBLER
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center max-w-[1500px] mx-auto px-4 lg:mt-8">
                <div className={`w-full lg:w-auto lg:flex-grow lg:block max-w-[1000px] ${activeTab === 'character' ? 'block' : 'hidden'}`}>
                    <div className="datafile-container mx-auto mb-10 w-full max-w-full">
                        <HeaderSection 
                            data={data} 
                            updateData={updateData} 
                            isPlayMode={isPlayMode} 
                            appMode={appMode}
                            setAppMode={setAppMode}
                        />
                        <PowerSetsSection powerSets={data.powerSets} onChange={(ps: PowerSet[]) => updateData({ powerSets: ps })} isPlayMode={isPlayMode} />
                        <SpecsSection specialties={data.specialties} onChange={(sp: Specialty[]) => updateData({ specialties: sp })} isPlayMode={isPlayMode} />
                        <MilestonesSection milestones={data.milestones} onChange={(m: Milestone[]) => updateData({ milestones: m })} isPlayMode={isPlayMode} />

                        <div className="bg-white p-4 border-t-4 border-black flex flex-wrap justify-end gap-4">
                            <button 
                                className="btn-comic btn-comic-red btn-comic-md"
                                onClick={handleReset}
                            >RESET DATA</button>
                            <button 
                                className="btn-comic btn-comic-blue btn-comic-md"
                                onClick={() => setIsJsonModalOpen(true)}
                            >IMPORT / EXPORT</button>
                            <button 
                                className="btn-comic btn-comic-green btn-comic-md"
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
                </div>
                
                <div className={`w-full lg:w-[450px] lg:block lg:flex-shrink-0 ${activeTab === 'assembler' ? 'block' : 'hidden'}`}>
                    <Assembler />
                </div>
            </div>
        </div>
    );
}

export default App;