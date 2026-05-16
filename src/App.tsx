import React, { useState, useEffect } from 'react';
import HeaderSection from './components/character/HeaderSection';
import PowerSetsSection from './components/character/PowerSetsSection';
import SpecsSection from './components/character/SpecsSection';
import MilestonesSection from './components/character/MilestonesSection';
import JsonModal from './components/JsonModal';
import { Assembler } from './components/assembler/Assembler';
import { BASE_CATEGORIES, TRAIT_CATEGORIES, Category } from './components/assembler/constants';
import { loadCharacterData, saveCharacterData, clearCharacterData, loadMode, saveMode } from './lib/persistence';
import { cn } from './lib/utils';
import { ComicButton } from './components/ui/ComicButton';
import { generateXPCommand, generatePPCommand } from './lib/cortexPal';

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

export interface PoolDie {
    id: string;
    value: number;
    label?: string;
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

interface ToastAction {
    label: string;
    onClick: () => void;
}

function App() {
    const [activeTab, setActiveTab] = useState<'character' | 'assembler'>('character');
    const [appMode, setAppMode] = useState<'edit' | 'play'>(() => loadMode());
    const [data, setData] = useState<CharacterData>(() => {
        const persisted = loadCharacterData();
        return persisted || defaultState;
    });
    const [pool, setPool] = useState<Record<string, PoolDie[]>>({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastAction, setToastAction] = useState<ToastAction | null>(null);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

    const triggerToast = (message: string, action?: ToastAction) => {
        setToastMessage(message);
        setToastAction(action || null);
        setShowToast(true);
        // If there's an action, we might want a longer timeout or manual close
        const duration = action ? 5000 : 2000;
        
        // Clear previous timeout if any
        if ((window as any).toastTimeout) clearTimeout((window as any).toastTimeout);
        
        (window as any).toastTimeout = setTimeout(() => {
            setShowToast(false);
            setToastAction(null);
        }, duration);
    };

    // Compute dynamic categories based on character power sets
    const categories: Category[] = [
        ...BASE_CATEGORIES,
        ...data.powerSets.map((ps, idx) => ({
            id: `ps-${idx}`,
            title: ps.name || `POWER SET ${idx + 1}`,
            sub: '',
            bg: idx % 2 === 0 ? '#f58a52' : '#fec594',
            textColor: 'text-black'
        })),
        ...TRAIT_CATEGORIES
    ];

    // Ensure pool keys exist for all categories
    useEffect(() => {
        setPool(prev => {
            const newPool = { ...prev };
            categories.forEach(cat => {
                if (!newPool[cat.id]) newPool[cat.id] = [];
            });
            return newPool;
        });
    }, [data.powerSets.length]);

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

    const addDieToPool = (categoryId: string, value: number, label?: string) => {
        setPool(prev => ({
            ...prev,
            [categoryId]: [...(prev[categoryId] || []), { id: generateId(), value, label }]
        }));
        if (navigator.vibrate) navigator.vibrate(15);
    };

    const handleMilestoneClick = (amount: number) => {
        const command = generateXPCommand(data.heroName, amount);
        triggerToast(`Earned ${amount} XP!`, {
            label: "APPLY & COPY",
            onClick: () => {
                updateData({ xp: data.xp + amount });
                if (command) {
                    navigator.clipboard.writeText(command).catch(err => console.error(err));
                    triggerToast(`XP applied and command copied!`);
                }
            }
        });
    };

    const handleHinderClick = (distIdx: number) => {
        const distName = data.distinctions[distIdx];
        const command = generatePPCommand(data.heroName, 1);
        
        triggerToast(`Hinder with ${distName}?`, {
            label: "APPLY & COPY",
            onClick: () => {
                // Add d4 to pool
                addDieToPool('dist', 4, `${distName} (Hinder)`);
                // Add 1 PP
                updateData({ pp: data.pp + 1 });
                // Copy command
                if (command) {
                    navigator.clipboard.writeText(command).catch(err => console.error(err));
                    triggerToast(`PP applied and command copied!`);
                }
            }
        });
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
                <ComicButton
                    variant={activeTab === 'character' ? 'red' : 'white'}
                    size="lg"
                    onClick={() => setActiveTab('character')}
                >
                    DATAFILE
                </ComicButton>
                <ComicButton
                    variant={activeTab === 'assembler' ? 'red' : 'white'}
                    size="lg"
                    onClick={() => setActiveTab('assembler')}
                >
                    DICE POOL ASSEMBLER
                </ComicButton>
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
                            onTraitClick={addDieToPool}
                            onHinderClick={handleHinderClick}
                        />
                        <PowerSetsSection 
                            powerSets={data.powerSets} 
                            onChange={(ps: PowerSet[]) => updateData({ powerSets: ps })} 
                            isPlayMode={isPlayMode} 
                            onTraitClick={addDieToPool}
                        />
                        <SpecsSection 
                            specialties={data.specialties} 
                            onChange={(sp: Specialty[]) => updateData({ specialties: sp })} 
                            isPlayMode={isPlayMode} 
                            onTraitClick={addDieToPool}
                        />
                        <MilestonesSection 
                            milestones={data.milestones} 
                            onChange={(m: Milestone[]) => updateData({ milestones: m })} 
                            isPlayMode={isPlayMode} 
                            onMilestoneClick={handleMilestoneClick}
                        />

                        <div className="bg-white p-4 border-t-4 border-black flex flex-wrap justify-end gap-4">
                            <ComicButton 
                                variant="red" 
                                size="md"
                                onClick={handleReset}
                            >RESET DATA</ComicButton>
                            <ComicButton 
                                variant="blue" 
                                size="md"
                                onClick={() => setIsJsonModalOpen(true)}
                            >IMPORT / EXPORT</ComicButton>
                            <ComicButton 
                                variant="green" 
                                size="md"
                                onClick={() => window.print()}
                            >PRINT PDF</ComicButton>
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
                    <Assembler pool={pool} setPool={setPool} categories={categories} onToast={triggerToast} />
                </div>
            </div>

            {/* Global Toast Notification */}
            <div className={cn(
                "fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-bold transition-all duration-300 z-[100] shadow-2xl border-2 border-white/20 text-center min-w-[300px] flex items-center justify-between gap-4",
                showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            )}>
                <span>{toastMessage}</span>
                {toastAction && (
                    <ComicButton 
                        size="xs" 
                        variant="green" 
                        className="pointer-events-auto shadow-none active:translate-y-0 active:translate-x-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            toastAction.onClick();
                            setShowToast(false);
                            setToastAction(null);
                        }}
                    >
                        {toastAction.label}
                    </ComicButton>
                )}
            </div>
        </div>
    );
}

export default App;
