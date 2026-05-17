import React from 'react';
import TraitItem from '../ui/TraitItem';
import { Specialty } from '../../App';
import { ComicButton } from '../ui/ComicButton';

interface SpecsSectionProps {
    specialties: Specialty[];
    onChange: (specialties: Specialty[]) => void;
    isPlayMode?: boolean;
    onTraitClick?: (categoryId: string, value: number, label: string) => void;
}

export default function SpecsSection({ 
    specialties, 
    onChange, 
    isPlayMode = false,
    onTraitClick
}: SpecsSectionProps) {
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addSpecialty = () => {
        onChange([...specialties, { id: generateId(), die: '8', name: 'NEW SPECIALTY' }]);
    };

    const updateSpecialty = (id: string, updates: Partial<Specialty>) => {
        onChange(specialties.map((sp: Specialty) => sp.id === id ? { ...sp, ...updates } : sp));
    };

    const removeSpecialty = (id: string) => {
        onChange(specialties.filter((sp: Specialty) => sp.id !== id));
    };

    const handleSpecClick = (sp: Specialty) => {
        if (onTraitClick) {
            onTraitClick('spec', parseInt(sp.die), sp.name);
        }
    };

    return (
        <div className="flex border-b-4 border-black">
            <div className="side-label bg-white border-r-4 border-black pt-4 px-2 w-10 flex-shrink-0 flex items-center justify-center">Specs</div>
            <div className="flex-grow comic-panel bg-comic-yellow p-4 m-0 border-0 flex flex-wrap gap-x-8 gap-y-4 justify-center items-center relative min-h-[100px] shadow-none border-b-0 border-t-0 border-l-0 border-r-0">
                {specialties.map((sp: Specialty) => (
                    <TraitItem
                        key={sp.id}
                        die={sp.die}
                        onDieChange={(val) => updateSpecialty(sp.id, { die: val })}
                        name={sp.name}
                        onNameChange={(val) => updateSpecialty(sp.id, { name: val })}
                        placeholder="Specialty"
                        isReadOnly={isPlayMode}
                        onTraitClick={() => handleSpecClick(sp)}
                        onRemove={() => removeSpecialty(sp.id)}
                    />
                ))}
                
                {!isPlayMode && (
                    <ComicButton 
                        variant="white" 
                        size="xs"
                        className="no-print" 
                        onClick={addSpecialty}
                    >+ ADD SPEC</ComicButton>
                )}
            </div>
        </div>
    );
}
