import { Book, GoogleBooksResponse, SelectOutcome } from '@/lib/static/types';

export default class BookHelpers {
    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    static upsert = async (params: {
        name: string;
        author: string;
        cover: string;
        genres: string[];
    }): Promise<Book | null> => {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        return res.ok ? ((await res.json()) as Book) : null;
    };

    static addFromSearch = async (
        result: GoogleBooksResponse
    ): Promise<SelectOutcome<Book>> => {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                author: result.author,
                cover: result.cover,
                genres: result.genres,
                isOldEntry: true,
                preventDuplicate: true,
            }),
        });
        if (res.status === 409) {
            const body = (await res.json()) as { error: string };
            return { error: body.error };
        }
        if (!res.ok) return { error: 'Failed to add book.' };
        return { saved: (await res.json()) as Book };
    };

    static delete = async (id: number): Promise<boolean> => {
        const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
        return res.ok;
    };
}
