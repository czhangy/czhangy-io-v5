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

export type TMDBMedia = {
    poster: string | null;
    genres: string[];
};

export type TMDBSearchResult = {
    id: number;
    name: string;
    year: string | null;
    mediaType: 'movie' | 'tv';
    poster: string | null;
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

export type BookSearchResult = {
    id: string;
    name: string;
    author: string | null;
    year: string | null;
    cover: string | null;
};

export type ReadMediaEntry = {
    id: number;
    name: string;
    author: string;
    bookId: string;
    cover: string;
    genres: string[];
    addedAt: string;
};

export type WatchedMediaEntry = {
    id: number;
    name: string;
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    poster: string;
    genres: string[];
    addedAt: string;
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
