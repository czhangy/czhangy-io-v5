'use client';

import AddSearchableModal from '@/components/common/AddSearchableModal/AddSearchableModal';
import { Content, SelectOutcome, TMDBResponse } from '@/lib/static/types';

type AddContentModalProps = {
    onClose: () => void;
    onAdd: (entry: Content) => void;
    onError: (message: string) => void;
};

const AddContentModal: React.FC<AddContentModalProps> = ({
    onClose,
    onAdd,
    onError,
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
            onError={onError}
        />
    );
};

export default AddContentModal;
