import React, { useState } from 'react';
import { CATEGORIES, DIE_SEQUENCE } from './constants';
import { InteractiveDie } from './InteractiveDie';
import { PoolDie } from '../../App';
import { ComicButton } from '../ui/ComicButton';

interface AssemblerProps {
    pool: Record<string, PoolDie[]>;
    setPool: React.Dispatch<React.SetStateAction<Record<string, PoolDie[]>>>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const Assembler: React.FC<AssemblerProps> = ({ pool, setPool }) => {
    const [showToast, setShowToast] = useState(false);

    // Handler: Add a d6 to the category
    const handleAddDie = (categoryId: string) => {
        setPool(prev => ({
            ...prev,
            [categoryId]: [...(prev[categoryId] || []), { id: generateId(), value: 6 }]
        }));
        // Haptic feedback if available
        if (navigator.vibrate) navigator.vibrate(15);
    };

    // Handler: Cycle the die value
    const handleCycleDie = (categoryId: string, dieIndex: number) => {
        setPool(prev => {
            const newPool = { ...prev };
            const currentDie = newPool[categoryId][dieIndex];
            const currentVal = currentDie.value;
            const currentIndex = DIE_SEQUENCE.indexOf(currentVal);
            // Cycle logic: d6-d8-d10-d12-d4-d6
            const nextVal = DIE_SEQUENCE[(currentIndex + 1) % DIE_SEQUENCE.length];

            const newDiceArray = [...newPool[categoryId]];
            newDiceArray[dieIndex] = { ...currentDie, value: nextVal };
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
        const initialPool: Record<string, PoolDie[]> = {};
        CATEGORIES.forEach(cat => initialPool[cat.id] = []);
        setPool(initialPool);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div className="assembler-wrapper bg-white font-sans h-full w-full relative comic-panel overflow-hidden">
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
                                {(pool[cat.id] || []).map((die, index) => (
                                    <div 
                                        key={die.id} 
                                        className="pointer-events-auto flex flex-col items-center justify-center min-w-[60px]"
                                        onClick={(e) => e.stopPropagation()}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => e.stopPropagation()}
                                    >
                                        <InteractiveDie
                                            type={die.value}
                                            categoryId={cat.id}
                                            dieIndex={index}
                                            onCycle={handleCycleDie}
                                            onRemove={handleRemoveDie}
                                        />
                                        {die.label && (
                                            <span className="font-comic-label text-[0.5rem] leading-none text-black text-center mt-[-4px] bg-white/80 px-1 border border-black/20 rounded-sm truncate w-full max-w-[56px]">
                                                {die.label}
                                            </span>
                                        )}
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
                    <ComicButton
                        onClick={handleClearPool}
                        variant="red"
                        size="lg"
                        className="px-8 rounded-sm"
                    >
                        CLEAR POOL
                    </ComicButton>
                </div>

            </div>
        </div>
    );
};
