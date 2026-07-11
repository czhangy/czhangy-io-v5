'use client';

import { useEffect, useReducer, useState } from 'react';
import Controls from '@/components/common/Controls/Controls';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
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

    type State = {
        categoryFilter: string;
        searchQuery: string;
        page: number;
        itemsPerPage: number;
    };

    type Action =
        | { type: 'SET_CATEGORY'; category: string }
        | { type: 'SET_SEARCH'; query: string }
        | { type: 'PREV_PAGE' }
        | { type: 'NEXT_PAGE' }
        | { type: 'RESIZE'; isMobile: boolean };

    const ITEMS_PER_PAGE_DESKTOP: number = 18;
    const ITEMS_PER_PAGE_MOBILE: number = 6;

    const INITIAL_STATE: State = {
        categoryFilter: '',
        searchQuery: '',
        page: 1,
        itemsPerPage: ITEMS_PER_PAGE_DESKTOP,
    };

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

    const handleCategoryChange = (value: string): void => {
        dispatch({ type: 'SET_CATEGORY', category: value });
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

    const getCreatedTimestamp = (a: Achievement): number =>
        new Date(a.createdAt).getTime();

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const { categoryFilter, searchQuery, page, itemsPerPage } = state;

    const sortedAchievements: Achievement[] = achievements
        .filter((a) => (categoryFilter ? a.category === categoryFilter : true))
        .filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const timestampDiff = getSortTimestamp(b) - getSortTimestamp(a);
            if (timestampDiff !== 0) {
                return timestampDiff;
            }
            return getCreatedTimestamp(b) - getCreatedTimestamp(a);
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
                filter={{
                    value: categoryFilter,
                    options: CATEGORIES,
                    maxLabel: 'Hobbies',
                    onChange: handleCategoryChange,
                }}
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
