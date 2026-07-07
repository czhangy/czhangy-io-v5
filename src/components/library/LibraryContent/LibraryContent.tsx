'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminActions from '@/components/common/AdminActions/AdminActions';
import AlertModal from '@/components/common/AlertModal/AlertModal';
import ListControls from '@/components/common/ListControls/ListControls';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import { Book } from '@/lib/static/types';
import AddBookModal from './AddBookModal/AddBookModal';
import styles from './LibraryContent.module.scss';

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
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (entry: Book): void => {
        const filtered = entries.filter((e) => e.id !== entry.id);
        const nextEntries = [...filtered, entry].sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        const index = nextEntries.findIndex((e) => e.id === entry.id);
        setEntries(nextEntries);
        setPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
    };

    const handleFeature = async (entry: Book): Promise<void> => {
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: entry.name,
                author: entry.author,
                cover: entry.cover,
                genres: entry.genres,
            }),
        });
        if (!res.ok) return;
        const updated = (await res.json()) as Book;
        const nextEntries = entries.map((e) =>
            e.id === updated.id ? updated : e
        );
        setEntries(nextEntries);
    };

    const handleDelete = async (id: number): Promise<void> => {
        const res = await fetch(`/api/books/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextEntries = entries.filter((e) => e.id !== id);
        const newTotalPages = Math.max(
            1,
            Math.ceil(filterEntries(nextEntries).length / ITEMS_PER_PAGE)
        );
        setEntries(nextEntries);
        setPage((p) => Math.min(p, newTotalPages));
    };

    const handleSearchChange = (value: string): void => {
        setSearchQuery(value);
        setPage(1);
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
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const filterEntries = (list: Book[]): Book[] =>
        list.filter((e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const filteredEntries: Book[] = filterEntries(entries);

    const totalPages: number = Math.max(
        1,
        Math.ceil(filteredEntries.length / ITEMS_PER_PAGE)
    );

    const paginatedEntries: Book[] = filteredEntries.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['library-content']}>
            <ListControls
                page={page}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                isAdmin={isAdmin}
                addLabel="Add Book"
                onAddClick={() => setIsAddOpen(true)}
                searchValue={searchQuery}
                searchPlaceholder="Search books..."
                onSearchChange={handleSearchChange}
            >
                {isAddOpen ? (
                    <AddBookModal
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

export default LibraryContent;
