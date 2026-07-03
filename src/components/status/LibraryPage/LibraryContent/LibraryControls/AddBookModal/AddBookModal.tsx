'use client';

import { useRef, useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import SearchInput from '@/components/status/SearchInput/SearchInput';
import { Key } from '@/lib/static/enums';
import { BookSearchResult, ReadMediaEntry } from '@/lib/static/types';

type AddBookModalProps = {
    onClose: () => void;
    onAdd: (entry: ReadMediaEntry) => void;
};

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setSearchResults([]);
        const res = await fetch(`/api/books/search?q=${encodeURIComponent(q)}`);
        const results: BookSearchResult[] = res.ok
            ? ((await res.json()) as BookSearchResult[])
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
        const result = searchResults.find((r) => r.id === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const res = await fetch('/api/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: result.name, bookId: result.id }),
        });
        if (!res.ok) return;
        const saved = (await res.json()) as ReadMediaEntry;
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
        <Modal title="ADD BOOK" onClose={onClose}>
            <SearchInput
                value={query}
                placeholder="Search books..."
                isSearching={isSearching}
                results={searchResults}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                onSelectResult={handleSelectResult}
                hideClear
            />
        </Modal>
    );
};

export default AddBookModal;
