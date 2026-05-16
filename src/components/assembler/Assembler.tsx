import React, { useState } from 'react';
import { CATEGORIES, DIE_SEQUENCE } from './constants';
import { InteractiveDie } from './InteractiveDie';
import './assembler.css';

export const Assembler: React.FC = () => {
    // State: A dictionary holding an array of dice values (numbers) for each category ID
    const [pool, setPool] = useState<Record<string, number[]>>(() => {
        const initialPool: Record<string, number[]> = {};
        CATEGORIES.forEach(cat => initialPool[cat.id] = []);
        return initialPool;
    });

    const [showToast, setShowToast] = useState(false);

    // Handler: Add a d6 to the category
    const handleAddDie = (categoryId: string) => {
        setPool(prev => ({
            ...prev,
            [categoryId]: [...prev[categoryId], 6]
        }));
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(15);
    };

    // Handler: Cycle the die value
    const handleCycleDie = (categoryId: string, dieIndex: number) => {
        setPool(prev => {
            const newPool = { ...prev };
            const currentVal = newPool[categoryId][dieIndex];
            const currentIndex = DIE_SEQUENCE.indexOf(currentVal);
            // Cycle logic: d6-d8-d10-d12-d4-d6
            const nextVal = DIE_SEQUENCE[(currentIndex + 1) % DIE_SEQUENCE.length];

            const newDiceArray = [...newPool[categoryId]];
            newDiceArray[dieIndex] = nextVal;
            newPool[categoryId] = newDiceArray;

            return newPool;
        });
        if (navigator.vibrate) navigator.vibrate(10);
    };

    // Handler: Remove a die entirely (triggered by long press)
    const handleRemoveDie = (categoryId: string, dieIndex: number) => {
        setPool(prev => {
            const newPool = { ...prev };
            const newDiceArray = [...newPool[categoryId]];
            newDiceArray.splice(dieIndex, 1);
            newPool[categoryId] = newDiceArray;
            return newPool;
        });
        if (navigator.vibrate) navigator.vibrate([20, 50, 20]);

        // Show a quick visual confirmation
        setShowToast(true);
        setTimeout(() => setShowToast(false), 1500);
    };

    // Clear the entire pool
    const handleClearPool = () => {
        const initialPool: Record<string, number[]> = {};
        CATEGORIES.forEach(cat => initialPool[cat.id] = []);
        setPool(initialPool);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div className="assembler-wrapper bg-white font-sans h-full w-full relative comic-panel">
            <div className="mx-auto p-4 flex flex-col items-center">
                {/* Header resembling the reference image */}
                <div className="text-center mb-6 w-full flex flex-col items-center border-b-4 border-black pb-4">
                    <h1 className="font-comic-title text-3xl text-black">DICE POOL</h1>
                    <h2 className="font-comic-title text-4xl text-black italic mt-[-5px]">ASSEMBLE!</h2>
                </div>

                {/* Category List */}
                <div className="w-full flex flex-col gap-3 pb-8">
                    {CATEGORIES.map(cat => (
                        <div
                            key={cat.id}
                            className="comic-panel w-full min-h-24 p-2 grid grid-cols-3 relative"
                            style={{ backgroundColor: cat.bg }}
                            onClick={() => handleAddDie(cat.id)}
                        >
                            {/* Background labels - Left side (1 column) */}
                            <div className="col-span-1 flex flex-col justify-center pointer-events-none z-0 border-r-2 border-black/10 pr-1">
                                <h3 className={`font-comic-label font-black text-lg leading-none ${cat.textColor} tracking-tight`} style={{ wordBreak: 'break-word' }}>
                                    {cat.title}
                                </h3>
                                {cat.sub && (
                                    <p className={`font-comic-label text-[0.65rem] leading-tight mt-1 opacity-80 ${cat.textColor}`}>
                                        {cat.sub}
                                    </p>
                                )}
                            </div>

                            {/* Dice Container - Right side (2 columns) with horizontal scrolling if needed */}
                            <div className="col-span-2 flex items-center gap-1 z-10 pl-2 overflow-x-auto overflow-y-visible pointer-events-none no-scrollbar flex-wrap">
                                {pool[cat.id].map((dieType, index) => (
                                    <div key={`${cat.id}-${index}-${dieType}`} className="pointer-events-auto flex-shrink-0">
                                        <InteractiveDie
                                            type={dieType}
                                            categoryId={cat.id}
                                            dieIndex={index}
                                            onCycle={handleCycleDie}
                                            onRemove={handleRemoveDie}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instructions Hint */}
                <p className="mt-4 text-center text-gray-500 text-sm font-comic-label font-bold">
                    <i className="fas fa-hand-pointer mr-1"></i> Tap empty space to add a d6.<br />
                    <i className="fas fa-sync-alt mr-1"></i> Tap a die to cycle its size.<br />
                    <i className="fas fa-compress-arrows-alt mr-1"></i> Press and hold a die to remove it.
                </p>

                {/* Toast Notification */}
                <div className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full font-bold transition-opacity duration-300 pointer-events-none z-50 ${showToast ? 'opacity-100' : 'opacity-0'}`}>
                    Die removed
                </div>

                {/* Clear Button fixed to bottom */}
                <div className="sticky bottom-0 w-full p-4 bg-white/90 backdrop-blur border-t-4 border-black flex justify-center z-40 mt-4">
                    <button
                        onClick={handleClearPool}
                        className="bg-red-500 hover:bg-red-600 text-white font-comic-title text-2xl py-2 px-8 rounded-sm border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-1 transition-all"
                    >
                        CLEAR POOL
                    </button>
                </div>

            </div>
        </div>
    );
};
