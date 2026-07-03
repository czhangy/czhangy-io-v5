export type RAWGGame = {
    cover: string | null;
    genres: string[];
};

export type RAWGSearchResult = {
    id: number;
    name: string;
    year: string | null;
    cover: string | null;
    genres: string[];
};

export type SpotifyTrack = {
    name: string;
    artist: string;
    albumArt: string;
    url: string;
};

export type TVmazeShow = {
    poster: string | null;
    url: string;
    genres: string[];
};

export type TVmazeSearchResult = {
    id: number;
    name: string;
    year: string | null;
};

export type NavItem = {
    href: string;
    label: string;
};

export type SkillCategory = 'Coding' | 'Cardistry' | 'Magic';

export type SkillEntry = {
    name: string;
    category: SkillCategory;
};

export type GameEntry = {
    name: string;
    rawgId: number;
};

export type ShowEntry = {
    name: string;
    tvmazeId: number;
};

export type UserRole = 'ADMIN' | 'USER';

export type Session = {
    id: string;
    role: UserRole;
};

export type AchievementFormValues = {
    tier: number;
    name: string;
    category: string;
    description: string;
    date: string;
};

export type Job = {
    company: string;
    title: string;
    startDate: string;
    endDate: string | null; // null = Present
    logo: string; // path relative to /public, e.g. '/logos/company.png'
};
