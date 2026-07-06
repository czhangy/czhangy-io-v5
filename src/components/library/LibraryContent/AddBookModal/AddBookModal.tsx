'use client';

import AddSearchableModal from '@/components/common/AddSearchableModal/AddSearchableModal';
import { Book, GoogleBooksResponse } from '@/lib/static/types';

type AddBookModalProps = {
    onClose: () => void;
    onAdd: (entry: Book) => void;
};

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAdd }) => {
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
    ): Promise<Book | null> => {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                author: result.author,
                cover: result.cover,
                genres: result.genres,
            }),
        });
        return res.ok ? ((await res.json()) as Book) : null;
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
        />
    );
};

export default AddBookModal;
