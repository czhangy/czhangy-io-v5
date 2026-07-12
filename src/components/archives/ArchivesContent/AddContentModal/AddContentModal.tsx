'use client';

import AddSearchableModal from '@/components/common/AddSearchableModal/AddSearchableModal';
import { Content, SelectOutcome, TMDBResponse } from '@/lib/static/types';
import ContentHelpers from '@/lib/utils/ContentHelpers';
import TMDBHelpers from '@/lib/utils/TMDBHelpers';

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
        return TMDBHelpers.search(query);
    };

    const handleSelect = async (
        result: TMDBResponse
    ): Promise<SelectOutcome<Content>> => {
        return ContentHelpers.addFromSearch(result);
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
