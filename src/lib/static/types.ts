// Models
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
    bookId: string;
    cover: string;
    genres: string[];
    addedAt: string;
};

export type Content = {
    name: string;
    tmdbId: number;
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
    id: number;
    name: string;
    note: string | null;
    mediaType: 'movie' | 'tv';
    poster: string | null;
};

export type TMDBMetadata = {
    poster: string | null;
    genres: string[];
};

export type GoogleBooksResponse = {
    id: string;
    name: string;
    author: string | null;
    note: string | null;
    cover: string | null;
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
