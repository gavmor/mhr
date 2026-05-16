export interface Category {
    id: string;
    title: string;
    sub: string;
    bg: string;
    textColor: string;
}

export const BASE_CATEGORIES: Category[] = [
    { id: 'affil', title: 'AFFILIATION', sub: 'd6, d8, or d10', bg: '#fbf579', textColor: 'text-black' },
    { id: 'dist', title: 'DISTINCTION', sub: 'd8 or d4 + 1 PP', bg: '#3fc959', textColor: 'text-black' },
];

export const TRAIT_CATEGORIES: Category[] = [
    { id: 'spec', title: 'SPECIALTY', sub: 'Expert: 2d6, Master: 2d8/3d6', bg: '#fbf579', textColor: 'text-black' },
    { id: 'stress', title: "OPPONENT'S STRESS", sub: '', bg: '#86bcf9', textColor: 'text-black' },
    { id: 'comp', title: "OPPONENT'S COMPLICATION", sub: '', bg: '#9163cc', textColor: 'text-black' },
    { id: 'asset', title: 'ASSET', sub: '', bg: '#e5523d', textColor: 'text-black' },
    { id: 'push', title: 'PUSH DIE, STUNT, OR RESOURCE', sub: '', bg: '#bef4f5', textColor: 'text-black' },
    { id: 'sfx', title: 'SFX: EXTRA DICE', sub: 'Afflict, Area, Constructs, etc.', bg: '#b5b9bb', textColor: 'text-black' },
];

export const DIE_SEQUENCE: number[] = [6, 8, 10, 12, 4];
