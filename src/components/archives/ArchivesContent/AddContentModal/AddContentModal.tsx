'use client';

import AddSearchableModal from '@/components/common/AddSearchableModal/AddSearchableModal';
import { Content, TMDBResponse } from '@/lib/static/types';

type AddContentModalProps = {
    onClose: () => void;
    onAdd: (entry: Content) => void;
};

const AddContentModal: React.FC<AddContentModalProps> = ({
    onClose,
    onAdd,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSearch = async (query: string): Promise<TMDBResponse[]> => {
        const res = await fetch(
            `/api/tmdb/search?q=${encodeURIComponent(query)}`
        );
        return res.ok ? ((await res.json()) as TMDBResponse[]) : [];
    };

    const handleSelect = async (
        result: TMDBResponse
    ): Promise<Content | null> => {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                mediaType: result.mediaType,
                poster: result.poster,
                genres: result.genres,
                isOldEntry: true,
            }),
        });
        return res.ok ? ((await res.json()) as Content) : null;
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <AddSearchableModal<TMDBResponse, Content>
            title="ADD CONTENT"
            placeholder="Search movies & shows..."
            search={handleSearch}
            toResult={(r) => ({
                id: r.tmdbId,
                name: r.name,
                note: r.note ?? undefined,
                image: r.poster ?? undefined,
                genres: r.genres,
            })}
            onSelect={handleSelect}
            onClose={onClose}
            onAdd={onAdd}
        />
    );
};

export default AddContentModal;
