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
        <div className="p-6 border-b-4 border-black bg-comic-yellow">
            <div className="flex flex-col md:flex-row justify-between items-end mb-4">
                <div className="w-full md:w-2/3">
                    <input 
                        type="text"
                        className="editable-input font-comic-title text-5xl md:text-7xl font-black text-red-600 tracking-wider mb-1"
                        style={{ textShadow: '2px 2px 0 #000' }}
                        placeholder="HERO NAME" 
                        value={data.heroName}
                        onChange={(e) => updateData({ heroName: e.target.value })}
                    />
                    <div className="flex items-center text-black font-bold text-lg font-comic-label">
                        <input 
                            type="text" 
                            className="editable-input w-auto flex-grow text-black" 
                            placeholder="Real Name"
                            value={data.realName}
                            onChange={(e) => updateData({ realName: e.target.value })}
                        />
                        <span className="mx-2">[</span>
                        <select
                            className="bg-transparent border-none outline-none text-black appearance-none cursor-pointer"
                            value={data.identityStatus}
                            onChange={(e) => updateData({ identityStatus: e.target.value })}
                        >
                            <option value="secret" className="bg-comic-yellow">secret</option>
                            <option value="public" className="bg-comic-yellow">public</option>
                        </select>
                        <span className="mx-2">]</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 h-full">
                {/* Portrait */}
                <div className="w-full md:w-1/3 comic-panel bg-white relative">
                    <label className="image-upload-wrapper block h-full min-h-[200px]">
                        <input type="file" accept="image/*" className="hidden" onChange={handlePortraitUpload} />
                        <img 
                            src={data.portrait || "https://placehold.co/400x300/ffffff/000000?text=Click+to+Upload+Image"}
                            alt="Character Portrait" 
                            className="w-full h-full object-cover min-h-[200px]"
                        />
                        <div className="upload-overlay">Upload Portrait</div>
                    </label>
                </div>

                {/* Affiliations & Distinctions */}
                <div className="w-full md:w-2/3 flex flex-col sm:flex-row comic-panel bg-comic-green p-0 border-4 border-black">
                    <div className="w-full sm:w-1/2 p-4 flex">
                        <div className="side-label border-r-2 border-black/10 pr-1">Affiliations</div>
                        <div className="flex flex-col justify-around w-full pl-4 space-y-2">
                            {['SOLO', 'BUDDY', 'TEAM'].map((label, idx) => (
                                <div key={label} className="flex items-center">
                                    <DieIcon value={data.affiliations[idx]} onChange={(val) => updateAffiliation(idx, val)} className="shadow-[2px_2px_0_0_#000]" />
                                    <span className="font-comic-label text-xl font-bold ml-4 tracking-widest text-black">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full sm:w-1/2 p-4 flex border-l-4 border-black bg-comic-green">
                        <div className="side-label border-r-2 border-black/10 pr-1">Distinctions</div>
                        <div className="flex flex-col justify-around w-full pl-2 space-y-4">
                            {[0, 1, 2].map((idx) => (
                                <EditableTextarea
                                    key={idx}
                                    className="font-comic-label text-xl font-bold text-black uppercase leading-tight"
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
                    <span className="font-comic-label font-bold text-xl text-black">XP</span>
                    <input 
                        type="number"
                        className="w-16 bg-white text-black font-bold text-center border-4 border-black focus:outline-none focus:border-red-500 shadow-comic h-10"
                        value={data.xp}
                        onChange={(e) => updateData({ xp: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-comic-label font-bold text-xl text-black">PP</span>
                    <input 
                        type="number"
                        className="w-16 bg-white text-black font-bold text-center border-4 border-black focus:outline-none focus:border-red-500 shadow-comic h-10"
                        value={data.pp}
                        onChange={(e) => updateData({ pp: parseInt(e.target.value) || 0 })}
                    />
                </div>

                <div className="flex comic-panel bg-comic-blue p-2">
                    <div className="side-label border-r-2 border-black/10 pr-1" style={{ fontSize: '0.7rem' }}>Stress</div>
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