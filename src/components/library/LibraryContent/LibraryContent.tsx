'use client';

import { useState } from 'react';
import Image from 'next/image';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import { Book } from '@/lib/static/types';
import styles from './LibraryContent.module.scss';
import LibraryControls from './LibraryControls/LibraryControls';

type LibraryContentProps = {
    initialEntries: Book[];
};

const LibraryContent: React.FC<LibraryContentProps> = ({ initialEntries }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const ITEMS_PER_PAGE: number = 10;

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<Book[]>(initialEntries);
    const [page, setPage] = useState<number>(1);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (entry: Book): void => {
        setEntries((prev) => {
            const filtered = prev.filter((e) => e.bookId !== entry.bookId);
            return [entry, ...filtered];
        });
        setPage(1);
    };

    const handleDelete = async (bookId: string): Promise<void> => {
        const res = await fetch(`/api/read/${encodeURIComponent(bookId)}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextEntries = entries.filter((e) => e.bookId !== bookId);
        const newTotalPages = Math.max(
            1,
            Math.ceil(nextEntries.length / ITEMS_PER_PAGE)
        );
        setEntries(nextEntries);
        setPage((p) => Math.min(p, newTotalPages));
    };

    const handlePrevPage = (): void => {
        setPage((p) => p - 1);
    };

    const handleNextPage = (): void => {
        setPage((p) => p + 1);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const totalPages: number = Math.max(
        1,
        Math.ceil(entries.length / ITEMS_PER_PAGE)
    );

    const paginatedEntries: Book[] = entries.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['library-content']}>
            <LibraryControls
                page={page}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                isAdmin={isAdmin}
                onAdd={handleAdd}
            />
            <ul className={styles.list}>
                {paginatedEntries.map((entry) => (
                    <li key={entry.bookId} className={styles.item}>
                        <Image
                            className={styles.cover}
                            src={entry.cover}
                            alt={`${entry.name} cover`}
                            width={43}
                            height={60}
                        />
                        <div className={styles.info}>
                            <span className={styles.name}>{entry.name}</span>
                            <span className={styles.author}>
                                {entry.author}
                            </span>
                            {entry.genres.length > 0 ? (
                                <div className={styles.genres}>
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
                        {isAdmin ? (
                            <button
                                type="button"
                                className={styles['delete-button']}
                                onClick={() => handleDelete(entry.bookId)}
                            >
                                <DeleteIcon />
                            </button>
                        ) : null}
                    </li>
                ))}
            </ul>
            <div className={styles.pagination}>
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={handlePrevPage}
                    onNext={handleNextPage}
                />
            </div>
        </div>
    );
};

export default LibraryContent;
