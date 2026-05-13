import React, { useState } from 'react';
import HeaderSection from './components/character/HeaderSection';
import PowerSetsSection from './components/character/PowerSetsSection';
import SpecsSection from './components/character/SpecsSection';
import MilestonesSection from './components/character/MilestonesSection';
import JsonModal from './components/JsonModal';

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
    const [data, setData] = useState<CharacterData>(defaultState);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

    const updateData = (updates: Partial<CharacterData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    return (
        <div className="datafile-container mx-auto">
            <HeaderSection data={data} updateData={updateData} />
            <PowerSetsSection powerSets={data.powerSets} onChange={(ps: PowerSet[]) => updateData({ powerSets: ps })} />
            <SpecsSection specialties={data.specialties} onChange={(sp: Specialty[]) => updateData({ specialties: sp })} />
            <MilestonesSection milestones={data.milestones} onChange={(m: Milestone[]) => updateData({ milestones: m })} />

            <div className="bg-gray-900 p-4 border-t border-gray-700 flex justify-end gap-4">
                <button 
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded font-bold"
                    onClick={() => setIsJsonModalOpen(true)}
                >Import/Export JSON</button>
                <button 
                    className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-bold"
                    onClick={() => window.print()}
                >Print / Save PDF</button>
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
    );
}

export default App;