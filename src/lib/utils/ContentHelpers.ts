import { Content, SelectOutcome, TMDBResponse } from '@/lib/static/types';

export default class ContentHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static upsert = async (params: {
        name: string;
        mediaType: 'movie' | 'tv';
        poster: string | null;
        genres: string[];
    }): Promise<Content | null> => {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        return res.ok ? ((await res.json()) as Content) : null;
    };

    static addFromSearch = async (
        result: TMDBResponse
    ): Promise<SelectOutcome<Content>> => {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                mediaType: result.mediaType,
                poster: result.poster,
                genres: result.genres,
                isOldEntry: true,
                preventDuplicate: true,
            }),
        });
        if (res.status === 409) {
            const body = (await res.json()) as { error: string };
            return { error: body.error };
        }
        if (!res.ok) return { error: 'Failed to add content.' };
        return { saved: (await res.json()) as Content };
    };

    static delete = async (id: number): Promise<boolean> => {
        const res = await fetch(`/api/content/${id}`, { method: 'DELETE' });
        return res.ok;
    };
}
