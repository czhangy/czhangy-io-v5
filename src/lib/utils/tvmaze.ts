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

export const getShowById = async (id: number): Promise<TVmazeShow | null> => {
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
};

export const searchShows = async (
    query: string
): Promise<TVmazeSearchResult[]> => {
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
};
