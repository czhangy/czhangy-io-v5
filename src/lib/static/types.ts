// Models
export type Achievement = {
    tier: number;
    name: string;
    category: string;
    description: string;
    date: string | null;
};

export type Move = {
    name: string;
    type: string;
    count: number;
    createdAt: string;
};

export type Game = {
    name: string;
    genre: string;
    icon: string;
    rating: number;
};

export type Book = {
    id: number;
    name: string;
    author: string;
    cover: string;
    genres: string[];
    addedAt: string;
};

export type Content = {
    name: string;
    mediaType: 'movie' | 'tv';
    poster: string;
    genres: string[];
    addedAt: string;
};

// External API responses
export type SpotifyResponse = {
    name: string;
    artist: string;
    albumArt: string;
    url: string;
};

export type TMDBResponse = {
    tmdbId: number;
    name: string;
    note: string | null;
    mediaType: 'movie' | 'tv';
    poster: string | null;
    genres: string[];
};

export type NBATeamResponse = {
    abbreviation: string;
    displayName: string;
    logo: string;
    score: string;
    record: string;
    streak: string;
    standing: string;
    isWinner: boolean;
    isHome: boolean;
    isWarriors: boolean;
};

export type NBAGameResponse = {
    date: string;
    away: NBATeamResponse;
    home: NBATeamResponse;
};

export type GoogleBooksResponse = {
    googleBooksId: string;
    name: string;
    author: string | null;
    note: string | null;
    cover: string | null;
    genres: string[];
};

// App
export type UserRole = 'ADMIN' | 'USER';

export type NavItem = {
    href: string;
    label: string;
};

export type Job = {
    company: string;
    title: string;
    startDate: string;
    endDate: string | null; // null = Present
    logo: string; // path relative to /public, e.g. '/logos/company.png'
};

export type CreateAchievementParams = {
    tier: number;
    name: string;
    category: string;
    description: string;
    date: string;
};
