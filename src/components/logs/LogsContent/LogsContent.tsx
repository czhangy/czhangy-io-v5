'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminActions from '@/components/common/AdminActions/AdminActions';
import Controls from '@/components/common/Controls/Controls';
import HighlightMatch from '@/components/common/HighlightMatch/HighlightMatch';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import { Log } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import LogHelpers from '@/lib/utils/LogHelpers';
import styles from './LogsContent.module.scss';

type LogsContentProps = {
    initialEntries: Log[];
};

const LogsContent: React.FC<LogsContentProps> = ({ initialEntries }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const ITEMS_PER_PAGE: number = 10;

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();
    const router = useRouter();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entries, setEntries] = useState<Log[]>(initialEntries);
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [tagFilter, setTagFilter] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleDelete = async (id: number): Promise<void> => {
        const success = await LogHelpers.delete(id);
        if (!success) return;
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

    const handleTagFilterChange = (value: string): void => {
        setTagFilter(value);
        setPage(1);
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

    const filterEntries = (list: Log[]): Log[] =>
        list
            .filter((e) =>
                e.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .filter((e) => (tagFilter ? e.tags.includes(tagFilter) : true));

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const allTags: string[] = [
        ...new Set(entries.flatMap((e) => e.tags)),
    ].sort();

    const maxTagLabel: string = [...allTags, 'All'].reduce((longest, tag) =>
        tag.length > longest.length ? tag : longest
    );

    const filteredEntries: Log[] = filterEntries(entries);

    const totalPages: number = Math.max(
        1,
        Math.ceil(filteredEntries.length / ITEMS_PER_PAGE)
    );

    const paginatedEntries: Log[] = filteredEntries.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['logs-content']}>
            <Controls
                filter={{
                    value: tagFilter,
                    options: allTags,
                    maxLabel: maxTagLabel,
                    onChange: handleTagFilterChange,
                }}
                search={{
                    value: searchQuery,
                    placeholder: 'Search logs...',
                    onChange: handleSearchChange,
                }}
                add={{
                    label: 'Add Log',
                    isAdmin,
                    onClick: () => router.push('/logs/new'),
                }}
                pagination={{
                    page,
                    totalPages,
                    onPrev: handlePrevPage,
                    onNext: handleNextPage,
                }}
            />
            <ul className={styles.list}>
                {paginatedEntries.map((entry) => (
                    <li key={entry.id} className={styles.item}>
                        <Link
                            href={`/logs/${entry.slug}`}
                            className={styles.info}
                        >
                            <div className={styles.header}>
                                <span className={styles.title}>
                                    <HighlightMatch
                                        text={entry.title}
                                        query={searchQuery}
                                    />
                                </span>
                                <span className={styles.date}>
                                    {DateHelpers.getHumanReadableDate(
                                        entry.createdAt
                                    )}
                                </span>
                            </div>
                            {entry.tags.length > 0 ? (
                                <div className={styles.tags}>
                                    {entry.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={styles['tag-pill']}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                            <p className={styles.excerpt}>
                                {LogHelpers.getExcerpt(entry.body)}
                            </p>
                        </Link>
                        {isAdmin ? (
                            <AdminActions
                                entryName={entry.title}
                                onEdit={() =>
                                    router.push(`/logs/${entry.slug}/edit`)
                                }
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

export default LogsContent;
