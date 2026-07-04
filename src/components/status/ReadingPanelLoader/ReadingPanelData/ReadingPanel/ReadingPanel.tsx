'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import SearchInput from '@/components/status/SearchInput/SearchInput';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import LinkIcon from '@/lib/icons/LinkIcon';
import PlusIcon from '@/lib/icons/PlusIcon';
import { Key } from '@/lib/static/enums';
import { BookSearchResult, ReadMediaEntry } from '@/lib/static/types';
import styles from './ReadingPanel.module.scss';

type ReadingPanelProps = {
    initialEntries: ReadMediaEntry[];
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const ReadingPanel: React.FC<ReadingPanelProps> = ({
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
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const MAX_ENTRIES: number = 3;

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<ReadMediaEntry[]>(initialEntries);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleStartAdd = (): void => {
        setIsAdding(true);
        setQuery('');
        setSearchResults([]);
    };

    const handleCancel = (): void => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        setIsAdding(false);
        setQuery('');
        setSearchResults([]);
        setIsSearching(false);
    };

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
        const filtered = entries.filter((e) => e.bookId !== saved.bookId);
        setEntries([saved, ...filtered].slice(0, MAX_ENTRIES));
        setIsAdding(false);
        setQuery('');
        setSearchResults([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Escape) handleCancel();
    };

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
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const headerActions: React.ReactNode = (
        <>
            <PanelButton href="/status/library" icon={<LinkIcon />} />
            {isAdmin ? (
                <PanelButton
                    onClick={handleStartAdd}
                    icon={<PlusIcon />}
                    disabled={isAdding}
                />
            ) : null}
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
                            placeholder="Search books..."
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
                    {entries.map((entry) => (
                        <li key={entry.id} className={styles.item}>
                            <Image
                                className={styles.cover}
                                src={entry.cover}
                                alt={`${entry.name} cover`}
                                width={43}
                                height={60}
                            />
                            <div className={styles.info}>
                                <span className={styles.title}>
                                    {entry.name}
                                </span>
                                <span className={styles.author}>
                                    {entry.author}
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

export default ReadingPanel;
