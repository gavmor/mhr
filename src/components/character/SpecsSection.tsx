import React from 'react';
import DieIcon from '../ui/DieIcon';
import { Specialty } from '../../App';

interface SpecsSectionProps {
    specialties: Specialty[];
    onChange: (specialties: Specialty[]) => void;
}

export default function SpecsSection({ specialties, onChange }: SpecsSectionProps) {
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

    return (
        <div className="flex border-b-4 border-black">
            <div className="side-label bg-white border-r-4 border-black pt-4 px-2 w-10 flex-shrink-0 flex items-center justify-center">Specs</div>
            <div className="flex-grow comic-panel bg-comic-yellow p-4 m-0 border-0 flex flex-wrap gap-x-8 gap-y-4 justify-center items-center relative min-h-[100px] shadow-none border-b-0 border-t-0 border-l-0 border-r-0">
                {specialties.map((sp: Specialty) => (
                    <div key={sp.id} className="flex items-center group relative">
                        <DieIcon value={sp.die} onChange={(val: string) => updateSpecialty(sp.id, { die: val })} className="shadow-[2px_2px_0_0_#000]" />
                        <input 
                            type="text" 
                            className="editable-input font-comic-label text-lg font-bold text-black uppercase ml-2 w-40" 
                            value={sp.name} 
                            onChange={(e) => updateSpecialty(sp.id, { name: e.target.value })}
                            placeholder="Specialty" 
                        />
                        <button 
                            className="absolute -right-4 top-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl font-black"
                            onClick={() => removeSpecialty(sp.id)}
                        >✕</button>
                    </div>
                ))}
                
                <button 
                    className="absolute right-4 top-4 text-sm text-black font-comic-label font-bold hover:underline" 
                    onClick={addSpecialty}
                >+ Add Spec</button>
            </div>
        </div>
    );
}