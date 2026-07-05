'use client';

import { useState } from 'react';
import Image from 'next/image';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import StarIcon from '@/lib/icons/StarIcon';
import { Content } from '@/lib/static/types';
import styles from './ArchivesContent.module.scss';
import ArchivesControls from './ArchivesControls/ArchivesControls';

type ArchivesContentProps = {
    initialEntries: Content[];
};

const ArchivesContent: React.FC<ArchivesContentProps> = ({
    initialEntries,
}) => {
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

    const [entries, setEntries] = useState<Content[]>(initialEntries);
    const [page, setPage] = useState<number>(1);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (entry: Content): void => {
        const filtered = entries.filter((e) => e.name !== entry.name);
        const nextEntries = [...filtered, entry].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
        const index = nextEntries.findIndex((e) => e.name === entry.name);
        setEntries(nextEntries);
        setPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
    };

    const handleFeature = async (entry: Content): Promise<void> => {
        const res = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: entry.name,
                mediaType: entry.mediaType,
                poster: entry.poster,
                genres: entry.genres,
            }),
        });
        if (!res.ok) return;
        const updated = (await res.json()) as Content;
        const nextEntries = entries.map((e) =>
            e.name === updated.name ? updated : e
        );
        setEntries(nextEntries);
    };

    const handleDelete = async (name: string): Promise<void> => {
        const res = await fetch(`/api/content/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextEntries = entries.filter((e) => e.name !== name);
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

    const paginatedEntries: Content[] = entries.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['archives-content']}>
            <ArchivesControls
                page={page}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                isAdmin={isAdmin}
                onAdd={handleAdd}
            />
            <ul className={styles.list}>
                {paginatedEntries.map((entry) => (
                    <li key={entry.name} className={styles.item}>
                        <Image
                            className={styles.poster}
                            src={entry.poster}
                            alt={`${entry.name} poster`}
                            width={43}
                            height={60}
                        />
                        <div className={styles.info}>
                            <span className={styles.name}>{entry.name}</span>
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
                            <div className={styles['admin-actions']}>
                                <button
                                    type="button"
                                    className={styles['action-button']}
                                    onClick={() => handleFeature(entry)}
                                >
                                    <StarIcon />
                                </button>
                                <button
                                    type="button"
                                    className={styles['action-button']}
                                    onClick={() => handleDelete(entry.name)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
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

export default ArchivesContent;
