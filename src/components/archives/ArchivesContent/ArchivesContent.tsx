'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminActions from '@/components/common/AdminActions/AdminActions';
import AlertModal from '@/components/common/AlertModal/AlertModal';
import ListControls from '@/components/common/ListControls/ListControls';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import { Content } from '@/lib/static/types';
import AddContentModal from './AddContentModal/AddContentModal';
import styles from './ArchivesContent.module.scss';

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
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (entry: Content): void => {
        const filtered = entries.filter((e) => e.id !== entry.id);
        const nextEntries = [...filtered, entry].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        const index = nextEntries.findIndex((e) => e.id === entry.id);
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
            e.id === updated.id ? updated : e
        );
        setEntries(nextEntries);
    };

    const handleDelete = async (id: number): Promise<void> => {
        const res = await fetch(`/api/content/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextEntries = entries.filter((e) => e.id !== id);
        const newTotalPages = Math.max(
            1,
            Math.ceil(nextEntries.length / ITEMS_PER_PAGE)
        );
        setEntries(nextEntries);
        setPage((p) => Math.min(p, newTotalPages));
    };

    const handleAddError = (message: string): void => {
        setIsAddOpen(false);
        setErrorMessage(message);
    };

    const handleErrorClose = (): void => {
        setErrorMessage('');
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
            <ListControls
                page={page}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                isAdmin={isAdmin}
                addLabel="Add Content"
                onAddClick={() => setIsAddOpen(true)}
            >
                {isAddOpen ? (
                    <AddContentModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAdd}
                        onError={handleAddError}
                    />
                ) : null}
            </ListControls>
            {errorMessage ? (
                <AlertModal
                    title="ERROR"
                    message={errorMessage}
                    onClose={handleErrorClose}
                />
            ) : null}
            <ul className={styles.list}>
                {paginatedEntries.map((entry) => (
                    <li key={entry.id} className={styles.item}>
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
                            <AdminActions
                                entryName={entry.name}
                                onHighlight={() => handleFeature(entry)}
                                onDelete={() => handleDelete(entry.id)}
                            />
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
