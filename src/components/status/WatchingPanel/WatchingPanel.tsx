'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useSession } from '@/lib/context/SessionContext';
import {
    ShowEntry,
    TVmazeSearchResult,
    TVmazeShow,
} from '@/lib/utils/shared/types';
import TVmazeHelpers from '@/lib/utils/TVmazeHelpers';
import PanelEditButton from '../PanelEditButton/PanelEditButton';
import SearchInput from '../SearchInput/SearchInput';
import StatusPanel from '../StatusPanel/StatusPanel';
import styles from './WatchingPanel.module.scss';

type WatchingPanelProps = {
    initialEntries: ShowEntry[];
    initialMeta: (TVmazeShow | null)[];
    label: string;
    icon: React.ReactNode;
    className?: string;
};

const WatchingPanel: React.FC<WatchingPanelProps> = ({
    initialEntries,
    initialMeta,
    label,
    icon,
    className,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<ShowEntry[]>(initialEntries);
    const [meta, setMeta] = useState<(TVmazeShow | null)[]>(initialMeta);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<TVmazeSearchResult[]>(
        []
    );
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setQuery(entries[index].name === '???' ? '' : entries[index].name);
        setSearchResults([]);
    };

    const handleCancel = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setEditingIndex(null);
        setQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSelectResult = async (id: number) => {
        if (editingIndex === null) return;
        const result = searchResults.find((r) => r.id === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const newEntry: ShowEntry = { name: result.name, tvmazeId: result.id };
        const newEntries = entries.map((e, i) =>
            i === editingIndex ? newEntry : e
        );
        const newShowMeta = await TVmazeHelpers.getShowById(result.id);
        await fetch('/api/status/shows', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntries) }),
        });
        setEntries(newEntries);
        setMeta(meta.map((m, i) => (i === editingIndex ? newShowMeta : m)));
        setEditingIndex(null);
        setQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') handleCancel();
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setSearchResults([]);
        const results = await TVmazeHelpers.searchShows(q);
        setSearchResults(results);
        setIsSearching(false);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel label={label} icon={icon} className={className}>
            <ul className={styles.list}>
                {entries.map((entry, i) => (
                    <li key={i} className={styles.item}>
                        {meta[i]?.poster ? (
                            <Image
                                className={styles.poster}
                                src={meta[i]!.poster!}
                                alt={`${entry.name} poster`}
                                width={43}
                                height={60}
                            />
                        ) : (
                            <div className={styles['poster-placeholder']} />
                        )}
                        {editingIndex === i ? (
                            <div className={styles['edit-form']}>
                                <SearchInput
                                    value={query}
                                    placeholder="Search shows..."
                                    isSearching={isSearching}
                                    results={searchResults}
                                    onChange={handleQueryChange}
                                    onKeyDown={handleKeyDown}
                                    onClear={handleCancel}
                                    onSelectResult={handleSelectResult}
                                />
                            </div>
                        ) : (
                            <div className={styles.info}>
                                <span className={styles.title}>
                                    {entry.name}
                                </span>
                                {meta[i]?.genres &&
                                meta[i]!.genres.length > 0 ? (
                                    <div className={styles.metadata}>
                                        {meta[i]!.genres.slice(0, 2).map(
                                            (g) => (
                                                <span
                                                    key={g}
                                                    className={
                                                        styles['genre-tag']
                                                    }
                                                >
                                                    {g}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        )}
                        {isAdmin && editingIndex !== i ? (
                            <PanelEditButton onClick={() => handleEdit(i)} />
                        ) : null}
                    </li>
                ))}
            </ul>
        </StatusPanel>
    );
};

export default WatchingPanel;
