import { TVmazeSearchResult, TVmazeShow } from './shared/types';

type TVmazeShowResponse = {
    url: string;
    image: { medium: string; original: string } | null;
    genres: string[];
};

type TVmazeSearchItemResponse = {
    show: {
        id: number;
        name: string;
        premiered: string | null;
    };
};

export default class TVmazeHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static async getShowById(id: number): Promise<TVmazeShow | null> {
        if (id <= 0) return null;
        const res = await fetch(`https://api.tvmaze.com/shows/${id}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = (await res.json()) as TVmazeShowResponse;
        return {
            poster: data.image?.medium ?? null,
            url: data.url,
            genres: data.genres ?? [],
        };
    }

    static async searchShows(query: string): Promise<TVmazeSearchResult[]> {
        if (!query.trim()) return [];
        const res = await fetch(
            `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as TVmazeSearchItemResponse[];
        return data.slice(0, 5).map(({ show }) => ({
            id: show.id,
            name: show.name,
            year: show.premiered?.slice(0, 4) ?? null,
        }));
    }
}
