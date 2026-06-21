'use client';

import { useEffect, useReducer } from 'react';
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

    type State = {
        sortField: SortField;
        sortDirection: SortDirection;
        categoryFilter: string;
        page: number;
        itemsPerPage: number;
    };

    type Action =
        | { type: 'SET_SORT_FIELD'; field: SortField }
        | { type: 'TOGGLE_DIRECTION' }
        | { type: 'SET_CATEGORY'; category: string }
        | { type: 'PREV_PAGE' }
        | { type: 'NEXT_PAGE' }
        | { type: 'RESIZE'; isMobile: boolean };

    const ITEMS_PER_PAGE_DESKTOP: number = 18;
    const ITEMS_PER_PAGE_MOBILE: number = 6;

    const INITIAL_STATE: State = {
        sortField: 'date',
        sortDirection: 'desc',
        categoryFilter: '',
        page: 1,
        itemsPerPage: ITEMS_PER_PAGE_DESKTOP,
    };

    const REDUCER = (state: State, action: Action): State => {
        switch (action.type) {
            case 'SET_SORT_FIELD':
                return { ...state, sortField: action.field, page: 1 };
            case 'TOGGLE_DIRECTION':
                return {
                    ...state,
                    sortDirection:
                        state.sortDirection === 'asc' ? 'desc' : 'asc',
                    page: 1,
                };
            case 'SET_CATEGORY':
                return { ...state, categoryFilter: action.category, page: 1 };
            case 'PREV_PAGE':
                return { ...state, page: state.page - 1 };
            case 'NEXT_PAGE':
                return { ...state, page: state.page + 1 };
            case 'RESIZE':
                return {
                    ...state,
                    itemsPerPage: action.isMobile
                        ? ITEMS_PER_PAGE_MOBILE
                        : ITEMS_PER_PAGE_DESKTOP,
                    page: 1,
                };
        }
    };

    const SORT_FIELDS: { value: SortField; label: string }[] = [
        { value: 'date', label: 'Date' },
        { value: 'name', label: 'Name' },
        { value: 'tier', label: 'Tier' },
    ];

    const CATEGORIES: string[] = [
        ...new Set(achievements.map((a) => a.category)),
    ].sort();

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const [state, dispatch] = useReducer(REDUCER, INITIAL_STATE);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleFieldChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        dispatch({
            type: 'SET_SORT_FIELD',
            field: e.target.value as SortField,
        });
    };

    const handleDirectionToggle = (): void => {
        dispatch({ type: 'TOGGLE_DIRECTION' });
    };

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        dispatch({ type: 'SET_CATEGORY', category: e.target.value });
    };

    const handlePrevPage = (): void => {
        dispatch({ type: 'PREV_PAGE' });
    };

    const handleNextPage = (): void => {
        dispatch({ type: 'NEXT_PAGE' });
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

    const { sortField, sortDirection, categoryFilter, page, itemsPerPage } =
        state;

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
        Math.ceil(sortedAchievements.length / itemsPerPage)
    );

    const paginatedAchievements: Achievement[] = sortedAchievements.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        const handleChange = (e: MediaQueryListEvent): void => {
            dispatch({ type: 'RESIZE', isMobile: e.matches });
        };
        dispatch({ type: 'RESIZE', isMobile: mq.matches });
        mq.addEventListener('change', handleChange);
        return () => mq.removeEventListener('change', handleChange);
    }, []);

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
                    <AchievementsControls />
                    <PaginationControls
                        page={page}
                        totalPages={totalPages}
                        onPrev={handlePrevPage}
                        onNext={handleNextPage}
                    />
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
