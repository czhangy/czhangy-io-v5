'use client';

import { useState } from 'react';
import AdminActions from '@/components/common/AdminActions/AdminActions';
import Controls from '@/components/common/Controls/Controls';
import HighlightMatch from '@/components/common/HighlightMatch/HighlightMatch';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import { Game } from '@/lib/static/types';
import AddGameModal from './AddGameModal/AddGameModal';
import EditGameModal from './EditGameModal/EditGameModal';
import styles from './GamesContent.module.scss';

type GamesContentProps = {
    initialGames: Game[];
};

const GamesContent: React.FC<GamesContentProps> = ({ initialGames }) => {
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

    const [games, setGames] = useState<Game[]>(initialGames);
    const [page, setPage] = useState<number>(1);
    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (game: Game): void => {
        const nextGames = [...games, game].sort((a, b) => {
            const ratingDiff = b.rating - a.rating;
            return ratingDiff !== 0 ? ratingDiff : a.name.localeCompare(b.name);
        });
        const index = nextGames.findIndex((g) => g.name === game.name);
        setGames(nextGames);
        setPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
    };

    const handleUpdate = (updated: Game): void => {
        setGames((prev) =>
            prev
                .map((g) => (g.name === updated.name ? updated : g))
                .sort((a, b) => {
                    const ratingDiff = b.rating - a.rating;
                    return ratingDiff !== 0
                        ? ratingDiff
                        : a.name.localeCompare(b.name);
                })
        );
        setEditingGame(null);
    };

    const handleDelete = async (name: string): Promise<void> => {
        const res = await fetch(`/api/games/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextGames = games.filter((g) => g.name !== name);
        const newTotalPages = Math.max(
            1,
            Math.ceil(filterGames(nextGames).length / ITEMS_PER_PAGE)
        );
        setGames(nextGames);
        setPage((p) => Math.min(p, newTotalPages));
    };

    const handleSearchChange = (value: string): void => {
        setSearchQuery(value);
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

    const filterGames = (list: Game[]): Game[] =>
        list.filter((g) =>
            g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const filteredGames: Game[] = filterGames(games);

    const totalPages: number = Math.max(
        1,
        Math.ceil(filteredGames.length / ITEMS_PER_PAGE)
    );

    const paginatedGames: Game[] = filteredGames.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['games-content']}>
            <Controls
                backLink={{ href: '/status', label: '← Back to Status' }}
                search={{
                    value: searchQuery,
                    placeholder: 'Search games...',
                    onChange: handleSearchChange,
                }}
                add={{
                    label: 'Add Game',
                    isAdmin,
                    onClick: () => setIsAddOpen(true),
                }}
                pagination={{
                    page,
                    totalPages,
                    onPrev: handlePrevPage,
                    onNext: handleNextPage,
                }}
            >
                {isAddOpen ? (
                    <AddGameModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAdd}
                    />
                ) : null}
            </Controls>
            <ul className={styles.list}>
                {paginatedGames.map((game) => (
                    <li key={game.name} className={styles.item}>
                        <div className={styles['icon-wrapper']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={styles.icon}
                                src={game.icon}
                                alt={`${game.name} icon`}
                                width={64}
                                height={64}
                            />
                        </div>
                        <div className={styles.details}>
                            <span className={styles.name}>
                                <HighlightMatch
                                    text={game.name}
                                    query={searchQuery}
                                />
                            </span>
                            <div className={styles.metadata}>
                                <span className={styles['genre-tag']}>
                                    {game.genre}
                                </span>
                            </div>
                            <div className={styles.rating}>
                                {[1, 2, 3, 4, 5].map((i) => {
                                    const isFull = game.rating >= i;
                                    const isHalf =
                                        !isFull && game.rating >= i - 0.5;
                                    return (
                                        <span
                                            key={i}
                                            className={`${styles.star}${isFull ? ` ${styles['star--full']}` : isHalf ? ` ${styles['star--half']}` : ''}`}
                                        >
                                            ★
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        {isAdmin ? (
                            <AdminActions
                                entryName={game.name}
                                onEdit={() => setEditingGame(game)}
                                onDelete={() => handleDelete(game.name)}
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
            {editingGame ? (
                <EditGameModal
                    game={editingGame}
                    onClose={() => setEditingGame(null)}
                    onEdit={handleUpdate}
                />
            ) : null}
        </div>
    );
};

export default GamesContent;
