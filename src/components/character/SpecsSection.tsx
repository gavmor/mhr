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
        <div className="flex border-t-2 border-blue-900">
            <div className="side-label bg-gray-900 border-r border-gray-800 pt-4">Specs</div>
            <div className="flex-grow bg-[#111827] p-4 flex flex-wrap gap-x-8 gap-y-4 justify-center items-center relative">
                {specialties.map((sp: Specialty) => (
                    <div key={sp.id} className="flex items-center group relative">
                        <DieIcon value={sp.die} onChange={(val: string) => updateSpecialty(sp.id, { die: val })} />
                        <input 
                            type="text" 
                            className="editable-input oswald-font text-lg font-bold text-white uppercase ml-2 w-40" 
                            value={sp.name} 
                            onChange={(e) => updateSpecialty(sp.id, { name: e.target.value })}
                            placeholder="Specialty" 
                        />
                        <button 
                            className="absolute -right-4 top-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            onClick={() => removeSpecialty(sp.id)}
                        >✕</button>
                    </div>
                ))}
                
                <button 
                    className="absolute right-4 top-4 text-sm text-blue-400 hover:text-blue-300" 
                    onClick={addSpecialty}
                >+ Add Spec</button>
            </div>
        </div>
    );
}