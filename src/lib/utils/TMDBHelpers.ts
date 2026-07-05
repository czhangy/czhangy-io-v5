import { TMDBMetadata, TMDBResponse } from '@/lib/static/types';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

type TMDBMultiResult = {
    id: number;
    media_type: string;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    poster_path?: string | null;
};

type TMDBMultiResponse = {
    results: TMDBMultiResult[];
};

type TMDBDetailsResponse = {
    poster_path: string | null;
    genres: { id: number; name: string }[];
};

export default class TMDBHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static readonly apiKey = process.env.TMDB_API_KEY;

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static async searchMedia(query: string): Promise<TMDBResponse[]> {
        if (!query.trim() || !this.apiKey) return [];
        const res = await fetch(
            `${BASE_URL}/search/multi?api_key=${this.apiKey}&query=${encodeURIComponent(query)}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as TMDBMultiResponse;
        return data.results
            .filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
            .filter((r) => (r.release_date ?? r.first_air_date)?.slice(0, 4))
            .filter((r) => r.poster_path)
            .slice(0, 5)
            .map((r) => ({
                tmdbId: r.id,
                name: r.title ?? r.name ?? '',
                note: (r.release_date ?? r.first_air_date)?.slice(0, 4) ?? null,
                mediaType: r.media_type as 'movie' | 'tv',
                poster: r.poster_path ? `${IMAGE_BASE}${r.poster_path}` : null,
            }));
    }

    static async getMediaById(
        id: number,
        mediaType: 'movie' | 'tv'
    ): Promise<TMDBMetadata | null> {
        if (id <= 0 || !this.apiKey) return null;
        const res = await fetch(
            `${BASE_URL}/${mediaType}/${id}?api_key=${this.apiKey}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return null;
        const data = (await res.json()) as TMDBDetailsResponse;
        return {
            poster: data.poster_path
                ? `${IMAGE_BASE}${data.poster_path}`
                : null,
            genres: data.genres.map((g) => g.name),
        };
    }
}
