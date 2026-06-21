'use client';

import { useState } from 'react';
import type { Achievement } from '@/generated/prisma/client';
import AchievementCard from '../AchievementCard/AchievementCard';
import AchievementsControls from '../AchievementsControls/AchievementsControls';
import styles from './AchievementsContent.module.scss';
import PaginationControls from './PaginationControls/PaginationControls';

type AchievementsContentProps = {
    achievements: Achievement[];
};

const AchievementsContent: React.FC<AchievementsContentProps> = ({
    achievements,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type SortField = 'date' | 'name' | 'tier';
    type SortDirection = 'asc' | 'desc';

    const ITEMS_PER_PAGE: number = 18;

    const SORT_FIELDS: { value: SortField; label: string }[] = [
        { value: 'date', label: 'Date' },
        { value: 'name', label: 'Name' },
        { value: 'tier', label: 'Tier' },
    ];

    const CATEGORIES: string[] = [
        ...new Set(achievements.map((a) => a.category)),
    ].sort();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleFieldChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setSortField(e.target.value as SortField);
        setPage(1);
    };

    const handleDirectionToggle = (): void => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        setPage(1);
    };

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setCategoryFilter(e.target.value);
        setPage(1);
    };

    const handlePrevPage = (): void => {
        setPage((prev) => prev - 1);
    };

    const handleNextPage = (): void => {
        setPage((prev) => prev + 1);
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const parseDate = (dateStr: string | null): number => {
        if (!dateStr) return 0;
        const [month, day, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day).getTime();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const sortedAchievements: Achievement[] = achievements
        .filter((a) => (categoryFilter ? a.category === categoryFilter : true))
        .sort((a, b) => {
            if (sortField === 'tier') {
                const tierDiff = b.tier - a.tier;
                if (tierDiff !== 0) {
                    return sortDirection === 'asc' ? tierDiff : -tierDiff;
                }
                return parseDate(b.date) - parseDate(a.date);
            }
            let comparison = 0;
            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else {
                comparison = parseDate(a.date) - parseDate(b.date);
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

    const totalPages: number = Math.max(
        1,
        Math.ceil(sortedAchievements.length / ITEMS_PER_PAGE)
    );

    const paginatedAchievements: Achievement[] = sortedAchievements.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['achievements-content']}>
            <div className={styles.controls}>
                <div className={styles.left}>
                    <select
                        className={styles.select}
                        value={categoryFilter}
                        onChange={handleCategoryChange}
                    >
                        <option value="">All</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <select
                        className={styles.select}
                        value={sortField}
                        onChange={handleFieldChange}
                    >
                        {SORT_FIELDS.map(({ value, label }) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <button
                        className={styles['direction-button']}
                        type="button"
                        onClick={handleDirectionToggle}
                    >
                        {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                    </button>
                </div>
                <div className={styles.right}>
                    <PaginationControls
                        page={page}
                        totalPages={totalPages}
                        onPrev={handlePrevPage}
                        onNext={handleNextPage}
                    />
                    <AchievementsControls />
                </div>
            </div>
            <div className={styles.grid}>
                {paginatedAchievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                    />
                ))}
            </div>
            <div className={styles.pagination}>
                <PaginationControls
                    page={page}
                    totalPages={totalPages}
                    onPrev={handlePrevPage}
                    onNext={handleNextPage}
                />
            </div>
        </div>
    );
};

export default AchievementsContent;
