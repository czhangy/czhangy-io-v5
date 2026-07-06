'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import EditButton from '@/components/status/EditButton/EditButton';
import LinkButton from '@/components/status/LinkButton/LinkButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { Content, TMDBResponse } from '@/lib/static/types';
import styles from './ContentPanel.module.scss';

type ContentPanelProps = {
    initialEntries: Content[];
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const ContentPanel: React.FC<ContentPanelProps> = ({
    initialEntries,
    label,
    icon,
    cols,
    rows,
    mobileOrder,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const MAX_ENTRIES = 5;

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<Content[]>(initialEntries);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<TMDBResponse[]>([]);
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

    const handleSelectResult = async (id: string | number) => {
        const result = searchResults.find((r) => r.tmdbId === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                mediaType: result.mediaType,
                poster: result.poster,
                genres: result.genres,
            }),
        });
        if (!res.ok) return;
        const saved = (await res.json()) as Content;
        const filtered = entries.filter((e) => e.name !== saved.name);
        setEntries([saved, ...filtered].slice(0, MAX_ENTRIES));
        setIsAdding(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleToggleAdd = (): void => {
        if (isAdding) {
            handleCancel();
            return;
        }
        handleStartAdd();
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const performSearch = async (q: string): Promise<void> => {
        setIsSearching(true);
        setSearchResults([]);
        const res = await fetch(`/api/tmdb/search?q=${encodeURIComponent(q)}`);
        const results: TMDBResponse[] = res.ok
            ? ((await res.json()) as TMDBResponse[])
            : [];
        setSearchResults(results);
        setIsSearching(false);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const headerActions: React.ReactNode = (
        <>
            <EditButton onClick={handleToggleAdd} active={isAdding} />
            <LinkButton href="/status/archives" />
        </>
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={headerActions}
            mobileOrder={mobileOrder}
        >
            <div className={styles.content}>
                {isAdding ? (
                    <div className={styles['add-form']}>
                        <SearchInput
                            value={query}
                            placeholder="Search movies & shows..."
                            isSearching={isSearching}
                            results={searchResults.map((r) => ({
                                ...r,
                                id: r.tmdbId,
                                note: r.note ?? undefined,
                                image: r.poster ?? undefined,
                            }))}
                            onChange={handleQueryChange}
                            onClear={handleCancel}
                            onSelectResult={handleSelectResult}
                        />
                    </div>
                ) : null}
                <ul className={styles.list}>
                    {entries.map((entry) => (
                        <li key={entry.name} className={styles.item}>
                            <Image
                                className={styles.poster}
                                src={entry.poster}
                                alt={`${entry.name} poster`}
                                width={43}
                                height={60}
                            />
                            <div className={styles.info}>
                                <span className={styles.title}>
                                    {entry.name}
                                </span>
                                {entry.genres.length > 0 ? (
                                    <div className={styles.metadata}>
                                        {entry.genres.slice(0, 2).map((g) => (
                                            <span
                                                key={g}
                                                className={styles['genre-tag']}
                                            >
                                                {g}
                                            </span>
                                        ))}
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

export default ContentPanel;
