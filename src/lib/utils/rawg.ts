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

type RAWGGameResponse = {
    background_image: string | null;
    genres: { name: string }[];
};

export const getGameById = async (id: number): Promise<RAWGGame | null> => {
    if (id <= 0) return null;
    const res = await fetch(
        `https://api.rawg.io/api/games/${id}?key=${process.env.RAWG_API_KEY}`,
        { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as RAWGGameResponse;
    return {
        cover: data.background_image ?? null,
        genres: data.genres?.map((g) => g.name) ?? [],
    };
};
