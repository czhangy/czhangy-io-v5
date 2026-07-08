'use client';

import { useEffect, useReducer, useState } from 'react';
import Controls from '@/components/common/Controls/Controls';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import FilterIcon from '@/lib/icons/FilterIcon';
import SortIcon from '@/lib/icons/SortIcon';
import { Achievement } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import AchievementCard from './AchievementCard/AchievementCard';
import styles from './AchievementsContent.module.scss';
import AddAchievementModal from './AddAchievementModal/AddAchievementModal';

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
        searchQuery: string;
        page: number;
        itemsPerPage: number;
    };

    type Action =
        | { type: 'SET_SORT_FIELD'; field: SortField }
        | { type: 'TOGGLE_DIRECTION' }
        | { type: 'SET_CATEGORY'; category: string }
        | { type: 'SET_SEARCH'; query: string }
        | { type: 'PREV_PAGE' }
        | { type: 'NEXT_PAGE' }
        | { type: 'RESIZE'; isMobile: boolean };

    const ITEMS_PER_PAGE_DESKTOP: number = 18;
    const ITEMS_PER_PAGE_MOBILE: number = 6;

    const INITIAL_STATE: State = {
        sortField: 'date',
        sortDirection: 'desc',
        categoryFilter: '',
        searchQuery: '',
        page: 1,
        itemsPerPage: ITEMS_PER_PAGE_DESKTOP,
    };

    const SORT_FIELDS: { value: SortField; label: string }[] = [
        { value: 'date', label: 'Date' },
        { value: 'name', label: 'Name' },
        { value: 'tier', label: 'Tier' },
    ];

    const SORT_FIELD_LABELS: string[] = SORT_FIELDS.map((f) => f.label);

    const CATEGORIES: string[] = [
        ...new Set(achievements.map((a) => a.category)),
    ].sort();

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    const [state, dispatch] = useReducer(
        (state: State, action: Action): State => {
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
                    return {
                        ...state,
                        categoryFilter: action.category,
                        page: 1,
                    };
                case 'SET_SEARCH':
                    return { ...state, searchQuery: action.query, page: 1 };
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
        },
        INITIAL_STATE
    );

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleFieldChange = (label: string): void => {
        dispatch({
            type: 'SET_SORT_FIELD',
            field: (SORT_FIELDS.find((f) => f.label === label)?.value ??
                'date') as SortField,
        });
    };

    const handleDirectionToggle = (): void => {
        dispatch({ type: 'TOGGLE_DIRECTION' });
    };

    const handleCategoryChange = (value: string): void => {
        dispatch({
            type: 'SET_CATEGORY',
            category: value === 'All' ? '' : value,
        });
    };

    const handleSearchChange = (value: string): void => {
        dispatch({ type: 'SET_SEARCH', query: value });
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

    const getSortTimestamp = (a: Achievement): number =>
        a.date
            ? DateHelpers.getUnixTimestamp(a.date)
            : new Date(a.createdAt).getTime();

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const {
        sortField,
        sortDirection,
        categoryFilter,
        searchQuery,
        page,
        itemsPerPage,
    } = state;

    const currentSortLabel: string =
        SORT_FIELDS.find((f) => f.value === sortField)?.label ??
        SORT_FIELDS[0].label;

    const sortedAchievements: Achievement[] = achievements
        .filter((a) => (categoryFilter ? a.category === categoryFilter : true))
        .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortField === 'tier') {
                const tierDiff = b.tier - a.tier;
                if (tierDiff !== 0) {
                    return sortDirection === 'asc' ? tierDiff : -tierDiff;
                }
                return getSortTimestamp(b) - getSortTimestamp(a);
            }
            let comparison = 0;
            if (sortField === 'name') {
                comparison = a.name
                    .toLowerCase()
                    .localeCompare(b.name.toLowerCase());
            } else {
                comparison = getSortTimestamp(a) - getSortTimestamp(b);
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
            <Controls
                left={
                    <>
                        <Dropdown
                            value={
                                categoryFilter === '' ? 'All' : categoryFilter
                            }
                            onChange={handleCategoryChange}
                            options={['All', ...CATEGORIES]}
                            icon={<FilterIcon />}
                            maxLabel="Hobbies"
                            variant="control"
                        />
                        <Dropdown
                            value={currentSortLabel}
                            onChange={handleFieldChange}
                            options={SORT_FIELD_LABELS}
                            icon={<SortIcon />}
                            variant="control"
                        />
                        <button
                            className={styles['direction-button']}
                            type="button"
                            onClick={handleDirectionToggle}
                        >
                            {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
                        </button>
                    </>
                }
                add={{
                    label: 'Add Achievement',
                    isAdmin: role === 'ADMIN',
                    onClick: () => setIsAddOpen(true),
                }}
                search={{
                    value: searchQuery,
                    placeholder: 'Search achievements...',
                    onChange: handleSearchChange,
                }}
                pagination={{
                    page,
                    totalPages,
                    onPrev: handlePrevPage,
                    onNext: handleNextPage,
                }}
            >
                {isAddOpen ? (
                    <AddAchievementModal onClose={() => setIsAddOpen(false)} />
                ) : null}
            </Controls>
            <div className={styles.grid}>
                {paginatedAchievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.name}
                        achievement={achievement}
                        searchQuery={searchQuery}
                    />
                ))}
            </div>
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

export default AchievementsContent;
