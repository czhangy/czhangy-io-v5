'use client';

import AddSearchableModal from '@/components/common/AddSearchableModal/AddSearchableModal';
import { Book, GoogleBooksResponse, SelectOutcome } from '@/lib/static/types';

type AddBookModalProps = {
    onClose: () => void;
    onAdd: (entry: Book) => void;
    onError: (message: string) => void;
};

const AddBookModal: React.FC<AddBookModalProps> = ({
    onClose,
    onAdd,
    onError,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSearch = async (
        query: string
    ): Promise<GoogleBooksResponse[]> => {
        const res = await fetch(
            `/api/google_books/search?q=${encodeURIComponent(query)}`
        );
        return res.ok ? ((await res.json()) as GoogleBooksResponse[]) : [];
    };

    const handleSelect = async (
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

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <AddSearchableModal<GoogleBooksResponse, Book>
            title="ADD BOOK"
            placeholder="Search books..."
            search={handleSearch}
            toResult={(r) => ({
                id: r.googleBooksId,
                name: r.name,
                note: r.note ?? undefined,
                image: r.cover ?? undefined,
                genres: r.genres,
            })}
            onSelect={handleSelect}
            onClose={onClose}
            onAdd={onAdd}
            onError={onError}
        />
    );
};

export default AddBookModal;
