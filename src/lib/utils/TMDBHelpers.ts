import { TMDBResponse } from '@/lib/static/types';

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
    genre_ids?: number[];
};

type TMDBMultiResponse = {
    results: TMDBMultiResult[];
};

export default class TMDBHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static readonly apiKey = process.env.TMDB_API_KEY;

    private static readonly MOVIE_GENRES: Record<number, string> = {
        28: 'Action',
        12: 'Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        14: 'Fantasy',
        36: 'History',
        27: 'Horror',
        10402: 'Music',
        9648: 'Mystery',
        10749: 'Romance',
        878: 'Science Fiction',
        10770: 'TV Movie',
        53: 'Thriller',
        10752: 'War',
        37: 'Western',
    };

    private static readonly TV_GENRES: Record<number, string> = {
        10759: 'Action & Adventure',
        16: 'Animation',
        35: 'Comedy',
        80: 'Crime',
        99: 'Documentary',
        18: 'Drama',
        10751: 'Family',
        10762: 'Kids',
        9648: 'Mystery',
        10763: 'News',
        10764: 'Reality',
        10765: 'Sci-Fi & Fantasy',
        10766: 'Soap',
        10767: 'Talk',
        10768: 'War & Politics',
        37: 'Western',
    };

    private static resolveGenres(
        genreIds: number[],
        mediaType: 'movie' | 'tv'
    ): string[] {
        const table =
            mediaType === 'movie' ? this.MOVIE_GENRES : this.TV_GENRES;
        return genreIds
            .map((id) => table[id])
            .filter((name): name is string => name !== undefined);
    }

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
            .filter((r) => r.genre_ids?.length)
            .slice(0, 12)
            .map((r) => ({
                tmdbId: r.id,
                name: r.title ?? r.name ?? '',
                note: (r.release_date ?? r.first_air_date)?.slice(0, 4) ?? null,
                mediaType: r.media_type as 'movie' | 'tv',
                poster: r.poster_path ? `${IMAGE_BASE}${r.poster_path}` : null,
                genres: this.resolveGenres(
                    r.genre_ids ?? [],
                    r.media_type as 'movie' | 'tv'
                ),
            }));
    }
}
