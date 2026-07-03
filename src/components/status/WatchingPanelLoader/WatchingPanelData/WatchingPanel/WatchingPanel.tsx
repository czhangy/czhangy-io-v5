'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import SearchInput from '@/components/status/SearchInput/SearchInput';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import PlusIcon from '@/lib/icons/PlusIcon';
import { Key } from '@/lib/static/enums';
import { ShowEntry, TVmazeSearchResult, TVmazeShow } from '@/lib/static/types';
import TVmazeHelpers from '@/lib/utils/TVmazeHelpers';
import styles from './WatchingPanel.module.scss';

type WatchingPanelProps = {
    initialEntries: ShowEntry[];
    initialMeta: (TVmazeShow | null)[];
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const WatchingPanel: React.FC<WatchingPanelProps> = ({
    initialEntries,
    initialMeta,
    label,
    icon,
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const MAX_SHOWS = 5;

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<ShowEntry[]>(initialEntries);
    const [meta, setMeta] = useState<(TVmazeShow | null)[]>(initialMeta);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<TVmazeSearchResult[]>(
        []
    );
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleStartAdd = () => {
        setIsAdding(true);
        setQuery('');
        setSearchResults([]);
    };

    const handleCancel = () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setIsAdding(false);
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
        const result = searchResults.find((r) => r.id === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const newEntry: ShowEntry = { name: result.name, tvmazeId: result.id };
        const newEntries = [newEntry, ...entries].slice(0, MAX_SHOWS);
        const newShowMeta = await TVmazeHelpers.getShowById(result.id);
        await fetch('/api/status/shows', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntries) }),
        });
        setEntries(newEntries);
        setMeta([newShowMeta, ...meta].slice(0, MAX_SHOWS));
        setIsAdding(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === Key.Escape) handleCancel();
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

    const addButton: React.ReactNode =
        isAdmin && !isAdding ? (
            <PanelButton onClick={handleStartAdd} icon={<PlusIcon />} />
        ) : null;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={addButton}
        >
            <div className={styles.content}>
                {isAdding ? (
                    <div className={styles['add-form']}>
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
                ) : null}
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
                        </li>
                    ))}
                </ul>
            </div>
        </StatusPanel>
    );
};

export default WatchingPanel;
