'use client';

import { useRef, useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import { Key } from '@/lib/static/enums';
import { SelectOutcome } from '@/lib/static/types';

type AddSearchableModalProps<TResult, TSaved> = {
    title: string;
    placeholder: string;
    search: (query: string) => Promise<TResult[]>;
    toResult: (result: TResult) => {
        id: string | number;
        name: string;
        note?: string;
        image?: string;
        genres?: string[];
    };
    onSelect: (result: TResult) => Promise<SelectOutcome<TSaved>>;
    onClose: () => void;
    onAdd: (saved: TSaved) => void;
    onError: (message: string) => void;
};

const AddSearchableModal = <TResult, TSaved>({
    title,
    placeholder,
    search,
    toResult,
    onSelect,
    onClose,
    onAdd,
    onError,
}: AddSearchableModalProps<TResult, TSaved>) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<TResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setSearchResults([]);
        setSearchResults(await search(q));
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
        const result = searchResults.find((r) => toResult(r).id === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const outcome = await onSelect(result);
        if ('error' in outcome) {
            onClose();
            onError(outcome.error);
            return;
        }
        onAdd(outcome.saved);
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
        <Modal title={title} onClose={onClose}>
            <SearchInput
                value={query}
                placeholder={placeholder}
                isSearching={isSearching}
                results={searchResults.map(toResult)}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                onSelectResult={handleSelectResult}
                hideClear
            />
        </Modal>
    );
};

export default AddSearchableModal;
