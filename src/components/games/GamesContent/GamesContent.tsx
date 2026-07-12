'use client';

import { useState } from 'react';
import Controls from '@/components/common/Controls/Controls';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import { Game } from '@/lib/static/types';
import GameHelpers from '@/lib/utils/GameHelpers';
import AddGameModal from './AddGameModal/AddGameModal';
import EditGameModal from './EditGameModal/EditGameModal';
import GameListItem from './GameListItem/GameListItem';
import styles from './GamesContent.module.scss';

type GamesContentProps = {
    initialGames: Game[];
    highlightedGame: Game | null;
};

const GamesContent: React.FC<GamesContentProps> = ({
    initialGames,
    highlightedGame,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const ITEMS_PER_PAGE: number = 10;
    const HIGHLIGHT_LABEL: string = 'CURRENTLY PLAYING';

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
    const [highlightedName, setHighlightedName] = useState<string | null>(
        highlightedGame?.name ?? null
    );

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
        const success = await GameHelpers.delete(name);
        if (!success) return;
        const nextGames = games.filter((g) => g.name !== name);
        const newTotalPages = Math.max(
            1,
            Math.ceil(filterGames(nextGames).length / ITEMS_PER_PAGE)
        );
        setGames(nextGames);
        setPage((p) => Math.min(p, newTotalPages));
        if (name === highlightedName) setHighlightedName(null);
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
        list.filter(
            (g) =>
                g.name !== highlightedName &&
                g.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const spotlightGame: Game | null =
        games.find((g) => g.name === highlightedName) ?? null;

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
            {spotlightGame ? (
                <ul className={styles.spotlight}>
                    <GameListItem
                        game={spotlightGame}
                        searchQuery={searchQuery}
                        isAdmin={isAdmin}
                        onEdit={() => setEditingGame(spotlightGame)}
                        onDelete={() => handleDelete(spotlightGame.name)}
                        highlightLabel={HIGHLIGHT_LABEL}
                    />
                </ul>
            ) : null}
            <ul className={styles.list}>
                {paginatedGames.map((game) => (
                    <GameListItem
                        key={game.name}
                        game={game}
                        searchQuery={searchQuery}
                        isAdmin={isAdmin}
                        onEdit={() => setEditingGame(game)}
                        onDelete={() => handleDelete(game.name)}
                    />
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
