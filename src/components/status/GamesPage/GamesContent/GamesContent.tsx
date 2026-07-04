'use client';

import { useState } from 'react';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import { Game } from '@/lib/static/types';
import EditGameModal from './EditGameModal/EditGameModal';
import styles from './GamesContent.module.scss';
import GamesControls from './GamesControls/GamesControls';

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

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (game: Game): void => {
        setGames((prev) =>
            [...prev, game].sort((a, b) => a.name.localeCompare(b.name))
        );
        setPage(1);
    };

    const handleUpdate = (updated: Game): void => {
        setGames((prev) =>
            prev
                .map((g) => (g.id === updated.id ? updated : g))
                .sort((a, b) => a.name.localeCompare(b.name))
        );
        setEditingGame(null);
    };

    const handleDelete = async (id: number): Promise<void> => {
        const res = await fetch(`/api/games/${id}`, { method: 'DELETE' });
        if (!res.ok) return;
        const nextGames = games.filter((g) => g.id !== id);
        const newTotalPages = Math.max(
            1,
            Math.ceil(nextGames.length / ITEMS_PER_PAGE)
        );
        setGames(nextGames);
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
        Math.ceil(games.length / ITEMS_PER_PAGE)
    );

    const paginatedGames: Game[] = games.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['games-content']}>
            <GamesControls
                page={page}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                isAdmin={isAdmin}
                onAdd={handleAdd}
            />
            <ul className={styles.list}>
                {paginatedGames.map((game) => (
                    <li key={game.id} className={styles.item}>
                        <div className={styles['icon-wrapper']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={styles.icon}
                                src={game.icon}
                                alt={`${game.name} icon`}
                                width={40}
                                height={40}
                            />
                        </div>
                        <div className={styles.details}>
                            <span className={styles.name}>{game.name}</span>
                            <div className={styles.metadata}>
                                <span className={styles['genre-tag']}>
                                    {game.genre}
                                </span>
                            </div>
                        </div>
                        {isAdmin ? (
                            <div className={styles['admin-actions']}>
                                <button
                                    type="button"
                                    className={styles['action-button']}
                                    onClick={() => setEditingGame(game)}
                                >
                                    <EditIcon />
                                </button>
                                <button
                                    type="button"
                                    className={styles['action-button']}
                                    onClick={() => handleDelete(game.id)}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        ) : null}
                    </li>
                ))}
            </ul>
            <div className={styles.pagination}>
                <PaginationControls
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
