'use client';

import AddSearchableModal from '@/components/common/AddSearchableModal/AddSearchableModal';
import { Book, GoogleBooksResponse, SelectOutcome } from '@/lib/static/types';
import BookHelpers from '@/lib/utils/BookHelpers';
import GoogleBooksHelpers from '@/lib/utils/GoogleBooksHelpers';

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
        return GoogleBooksHelpers.search(query);
    };

    const handleSelect = async (
        result: GoogleBooksResponse
    ): Promise<SelectOutcome<Book>> => {
        return BookHelpers.addFromSearch(result);
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
