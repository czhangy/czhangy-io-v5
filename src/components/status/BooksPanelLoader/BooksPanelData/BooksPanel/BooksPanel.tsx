'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import EditButton from '@/components/status/EditButton/EditButton';
import LinkButton from '@/components/status/LinkButton/LinkButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { Key } from '@/lib/static/enums';
import { Book, GoogleBooksResponse } from '@/lib/static/types';
import styles from './BooksPanel.module.scss';

type BooksPanelProps = {
    initialEntries: Book[];
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const BooksPanel: React.FC<BooksPanelProps> = ({
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

    const MAX_ENTRIES: number = 3;

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<Book[]>(initialEntries);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [query, setQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<GoogleBooksResponse[]>(
        []
    );
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
        const result = searchResults.find((r) => r.googleBooksId === id);
        if (!result) return;
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: result.name,
                author: result.author,
                cover: result.cover,
                genres: result.genres,
            }),
        });
        if (!res.ok) return;
        const saved = (await res.json()) as Book;
        const filtered = entries.filter((e) => e.id !== saved.id);
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
        const res = await fetch(
            `/api/google_books/search?q=${encodeURIComponent(q)}`
        );
        const results: GoogleBooksResponse[] = res.ok
            ? ((await res.json()) as GoogleBooksResponse[])
            : [];
        setSearchResults(results);
        setIsSearching(false);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const headerActions: React.ReactNode = (
        <>
            <EditButton onClick={handleStartAdd} disabled={isAdding} />
            <LinkButton href="/status/library" />
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
                            results={searchResults.map((r) => ({
                                ...r,
                                id: r.googleBooksId,
                                note: r.note ?? undefined,
                                image: r.cover ?? undefined,
                            }))}
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

export default BooksPanel;
