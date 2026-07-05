'use client';

import { useRef, useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import { Key } from '@/lib/static/enums';
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
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<TMDBResponse[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setSearchResults([]);
        const res = await fetch(`/api/media/search?q=${encodeURIComponent(q)}`);
        const results: TMDBResponse[] = res.ok
            ? ((await res.json()) as TMDBResponse[])
            : [];
        setSearchResults(results);
        setIsSearching(false);
    };

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleQueryChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = e.target.value;
        setQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(value);
        }, 1000);
    };

    const handleSelectResult = async (id: string | number): Promise<void> => {
        const result = searchResults.find((r) => r.tmdbId === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const res = await fetch('/api/watched', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                tmdbId: result.tmdbId,
                mediaType: result.mediaType,
            }),
        });
        if (!res.ok) return;
        const saved = (await res.json()) as Content;
        onAdd(saved);
        onClose();
    };

    const handleClear = (): void => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Escape) onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD CONTENT" onClose={onClose}>
            <SearchInput
                value={query}
                placeholder="Search movies & shows..."
                isSearching={isSearching}
                results={searchResults.map((r) => ({ ...r, id: r.tmdbId }))}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                onSelectResult={handleSelectResult}
                hideClear
            />
        </Modal>
    );
};

export default AddContentModal;
