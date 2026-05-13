import React from 'react';
import DieIcon from '../ui/DieIcon';
import EditableTextarea from '../ui/EditableTextarea';
import StressTrack from './StressTrack';
import { CharacterData } from '../../App';

interface HeaderSectionProps {
    data: CharacterData;
    updateData: (updates: Partial<CharacterData>) => void;
}

export default function HeaderSection({ data, updateData }: HeaderSectionProps) {
    const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    updateData({ portrait: ev.target.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const updateAffiliation = (index: number, val: string) => {
        const newAffs = [...data.affiliations];
        newAffs[index] = val;
        updateData({ affiliations: newAffs });
    };

    const updateDistinction = (index: number, val: string) => {
        const newDists = [...data.distinctions];
        newDists[index] = val;
        updateData({ distinctions: newDists });
    };

    return (
        <div className="p-6 border-b-2 border-blue-900 bg-gray-900">
            <div className="flex flex-col md:flex-row justify-between items-end mb-4">
                <div className="w-full md:w-2/3">
                    <input 
                        type="text"
                        className="editable-input oswald-font text-5xl md:text-6xl font-black text-white uppercase tracking-wider mb-1"
                        placeholder="HERO NAME" 
                        value={data.heroName}
                        onChange={(e) => updateData({ heroName: e.target.value })}
                    />
                    <div className="flex items-center text-gray-400 text-lg">
                        <input 
                            type="text" 
                            className="editable-input w-auto flex-grow" 
                            placeholder="Real Name"
                            value={data.realName}
                            onChange={(e) => updateData({ realName: e.target.value })}
                        />
                        <span className="mx-2">[</span>
                        <select
                            className="bg-transparent border-none outline-none text-gray-400 appearance-none cursor-pointer"
                            value={data.identityStatus}
                            onChange={(e) => updateData({ identityStatus: e.target.value })}
                        >
                            <option value="secret" className="bg-gray-800">secret</option>
                            <option value="public" className="bg-gray-800">public</option>
                        </select>
                        <span className="mx-2">]</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 h-full">
                {/* Portrait */}
                <div className="w-full md:w-1/3 border-2 border-gray-700 bg-gray-800 relative">
                    <label className="image-upload-wrapper block h-full min-h-[200px]">
                        <input type="file" accept="image/*" className="hidden" onChange={handlePortraitUpload} />
                        <img 
                            src={data.portrait || "https://placehold.co/400x300/1f2937/9ca3af?text=Click+to+Upload+Image"}
                            alt="Character Portrait" 
                            className="w-full h-full object-cover min-h-[200px]"
                        />
                        <div className="upload-overlay">Upload Portrait</div>
                    </label>
                </div>

                {/* Affiliations & Distinctions */}
                <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-4 border border-gray-700 bg-gray-800">
                    <div className="w-full sm:w-1/2 p-4 flex">
                        <div className="side-label">Affiliations</div>
                        <div className="flex flex-col justify-around w-full pl-4 space-y-2">
                            {['SOLO', 'BUDDY', 'TEAM'].map((label, idx) => (
                                <div key={label} className="flex items-center">
                                    <DieIcon value={data.affiliations[idx]} onChange={(val) => updateAffiliation(idx, val)} />
                                    <span className="oswald-font text-xl font-bold ml-4 tracking-widest text-white">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full sm:w-1/2 p-4 flex border-l border-gray-700">
                        <div className="side-label">Distinctions</div>
                        <div className="flex flex-col justify-around w-full pl-2 space-y-4">
                            {[0, 1, 2].map((idx) => (
                                <EditableTextarea
                                    key={idx}
                                    className="oswald-font text-xl font-bold text-white uppercase leading-tight"
                                    placeholder={`Distinction ${idx + 1}`}
                                    value={data.distinctions[idx]}
                                    onChange={(val) => updateDistinction(idx, val)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap md:flex-nowrap justify-end items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <span className="oswald-font font-bold text-xl text-white">XP</span>
                    <input 
                        type="number"
                        className="w-16 bg-white text-black font-bold text-center border-2 border-gray-400 focus:outline-none focus:border-blue-500"
                        value={data.xp}
                        onChange={(e) => updateData({ xp: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="oswald-font font-bold text-xl text-white">PP</span>
                    <input 
                        type="number"
                        className="w-16 bg-white text-black font-bold text-center border-2 border-gray-400 focus:outline-none focus:border-blue-500"
                        value={data.pp}
                        onChange={(e) => updateData({ pp: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div className="flex bg-gray-800 border border-gray-700 p-2">
                    <div className="side-label" style={{ fontSize: '0.7rem' }}>Stress/Trauma</div>
                    <div className="flex flex-col gap-2 pl-2">
                        <StressTrack prefix="P" level={data.stress.p} onChange={(val) => updateData({ stress: { ...data.stress, p: val } })} />
                        <StressTrack prefix="M" level={data.stress.m} onChange={(val) => updateData({ stress: { ...data.stress, m: val } })} />
                        <StressTrack prefix="E" level={data.stress.e} onChange={(val) => updateData({ stress: { ...data.stress, e: val } })} />
                    </div>
                </div>
            </div>
        </div>
    );
}