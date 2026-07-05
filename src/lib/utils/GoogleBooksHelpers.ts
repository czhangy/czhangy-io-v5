import { GoogleBooksResponse } from '@/lib/static/types';

const BASE_URL = 'https://www.googleapis.com/books/v1';

type GoogleBooksVolumeInfo = {
    title: string;
    authors?: string[];
    publishedDate?: string;
    categories?: string[];
    imageLinks?: {
        thumbnail?: string;
        smallThumbnail?: string;
    };
};

type GoogleBooksItem = {
    id: string;
    volumeInfo: GoogleBooksVolumeInfo;
};

type GoogleBooksSearchResponse = {
    items?: GoogleBooksItem[];
};

type GoogleBooksMeta = {
    author: string | null;
    cover: string | null;
    genres: string[];
};

export default class GoogleBooksHelpers {
    // -------------------------------------------------------------------------
    // PRIVATE
    // -------------------------------------------------------------------------

    private static readonly apiKey = process.env.GOOGLE_BOOKS_API_KEY;

    private static coverUrl(info: GoogleBooksVolumeInfo): string | null {
        const url =
            info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;
        return url ? url.replace('http:', 'https:') : null;
    }

    private static titleCase(str: string): string {
        return str
            .trim()
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
    }

    private static normalizeGenres(categories: string[]): string[] {
        const segments = categories.map((cat) =>
            cat.split('/').map((s) => this.titleCase(s))
        );
        const maxDepth = Math.max(...segments.map((s) => s.length), 0);
        const seen = new Set<string>();
        const result: string[] = [];
        let fictionIndex: number | null = null;

        for (let level = 0; level < maxDepth && result.length < 2; level++) {
            for (const segs of segments) {
                if (level >= segs.length) continue;
                const genre = segs[level];
                if (genre === 'General' || seen.has(genre)) continue;

                const isFiction = genre.includes('Fiction');

                if (isFiction && fictionIndex !== null) {
                    if (
                        result[fictionIndex] === 'Fiction' &&
                        genre !== 'Fiction'
                    ) {
                        seen.delete('Fiction');
                        seen.add(genre);
                        result[fictionIndex] = genre;
                    }
                    continue;
                }

                seen.add(genre);
                if (isFiction) fictionIndex = result.length;
                result.push(genre);
                if (result.length === 2) break;
            }
        }

        return result;
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static async searchBooks(query: string): Promise<GoogleBooksResponse[]> {
        if (!query.trim()) return [];
        const keyParam = this.apiKey ? `&key=${this.apiKey}` : '';
        const res = await fetch(
            `${BASE_URL}/volumes?q=${encodeURIComponent(query)}&maxResults=8&printType=books${keyParam}`,
            { cache: 'no-store' }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as GoogleBooksSearchResponse;
        return (data.items ?? [])
            .filter((item) => this.coverUrl(item.volumeInfo) !== null)
            .filter((item) => item.volumeInfo.publishedDate)
            .filter((item) => item.volumeInfo.authors?.length)
            .map((item) => ({
                googleBooksId: item.id,
                name: item.volumeInfo.title,
                author: item.volumeInfo.authors?.[0] ?? null,
                note: item.volumeInfo.publishedDate?.split('-')[0] ?? null,
                cover: this.coverUrl(item.volumeInfo),
            }));
    }

    static async getBookById(id: string): Promise<GoogleBooksMeta | null> {
        const keyParam = this.apiKey ? `?key=${this.apiKey}` : '';
        const res = await fetch(`${BASE_URL}/volumes/${id}${keyParam}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const item = (await res.json()) as GoogleBooksItem;
        return {
            author: item.volumeInfo.authors?.[0] ?? null,
            cover: this.coverUrl(item.volumeInfo),
            genres: this.normalizeGenres(item.volumeInfo.categories ?? []),
        };
    }
}
