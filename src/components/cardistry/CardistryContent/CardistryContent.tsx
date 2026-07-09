'use client';

import { useState } from 'react';
import Controls from '@/components/common/Controls/Controls';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import { Move } from '@/lib/static/types';
import AddMoveModal from './AddMoveModal/AddMoveModal';
import styles from './CardistryContent.module.scss';
import EditMoveModal from './EditMoveModal/EditMoveModal';
import MoveListItem from './MoveListItem/MoveListItem';

type CardistryContentProps = {
    initialMoves: Move[];
    highlightedMove: Move | null;
};

const CardistryContent: React.FC<CardistryContentProps> = ({
    initialMoves,
    highlightedMove,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const ITEMS_PER_PAGE: number = 10;
    const HIGHLIGHT_LABEL: string = 'CURRENTLY PRACTICING';

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [moves, setMoves] = useState<Move[]>(initialMoves);
    const [page, setPage] = useState<number>(1);
    const [editingMove, setEditingMove] = useState<Move | null>(null);
    const [incrementingMoves, setIncrementingMoves] = useState<Set<string>>(
        new Set()
    );
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [highlightedName, setHighlightedName] = useState<string | null>(
        highlightedMove?.name ?? null
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (move: Move): void => {
        const filtered = moves.filter((m) => m.name !== move.name);
        const nextMoves = [...filtered, move].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
        const index = nextMoves.findIndex((m) => m.name === move.name);
        setMoves(nextMoves);
        setPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
    };

    const handleUpdate = (updated: Move): void => {
        setMoves((prev) =>
            prev.map((m) => (m.name === updated.name ? updated : m))
        );
        setEditingMove(null);
    };

    const handleIncrement = async (
        move: Move,
        amount: number
    ): Promise<void> => {
        setIncrementingMoves((prev) => new Set(prev).add(move.name));
        const res = await fetch(`/api/moves/${encodeURIComponent(move.name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: move.name,
                type: move.type,
                tutorial: move.tutorial,
                count: move.count + amount,
            }),
        });
        setIncrementingMoves((prev) => {
            const next = new Set(prev);
            next.delete(move.name);
            return next;
        });
        if (!res.ok) return;
        const updated = (await res.json()) as Move;
        setMoves((prev) =>
            prev.map((m) => (m.name === updated.name ? updated : m))
        );
    };

    const handleDelete = async (name: string): Promise<void> => {
        const res = await fetch(`/api/moves/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextMoves = moves.filter((m) => m.name !== name);
        const newTotalPages = Math.max(
            1,
            Math.ceil(filterMoves(nextMoves).length / ITEMS_PER_PAGE)
        );
        setMoves(nextMoves);
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

    const filterMoves = (list: Move[]): Move[] =>
        list.filter(
            (m) =>
                m.name !== highlightedName &&
                m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const spotlightMove: Move | null =
        moves.find((m) => m.name === highlightedName) ?? null;

    const filteredMoves: Move[] = filterMoves(moves);

    const totalPages: number = Math.max(
        1,
        Math.ceil(filteredMoves.length / ITEMS_PER_PAGE)
    );

    const paginatedMoves: Move[] = filteredMoves.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['cardistry-content']}>
            <Controls
                backLink={{ href: '/status', label: '← Back to Status' }}
                search={{
                    value: searchQuery,
                    placeholder: 'Search moves...',
                    onChange: handleSearchChange,
                }}
                add={{
                    label: 'Add Move',
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
                    <AddMoveModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAdd}
                    />
                ) : null}
            </Controls>
            {spotlightMove ? (
                <ul className={styles.spotlight}>
                    <MoveListItem
                        move={spotlightMove}
                        searchQuery={searchQuery}
                        isAdmin={isAdmin}
                        isIncrementing={incrementingMoves.has(
                            spotlightMove.name
                        )}
                        onIncrement={(amount) =>
                            handleIncrement(spotlightMove, amount)
                        }
                        onEdit={() => setEditingMove(spotlightMove)}
                        onDelete={() => handleDelete(spotlightMove.name)}
                        highlightLabel={HIGHLIGHT_LABEL}
                    />
                </ul>
            ) : null}
            <ul className={styles.list}>
                {paginatedMoves.map((move) => (
                    <MoveListItem
                        key={move.name}
                        move={move}
                        searchQuery={searchQuery}
                        isAdmin={isAdmin}
                        isIncrementing={incrementingMoves.has(move.name)}
                        onIncrement={(amount) => handleIncrement(move, amount)}
                        onEdit={() => setEditingMove(move)}
                        onDelete={() => handleDelete(move.name)}
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
            {editingMove ? (
                <EditMoveModal
                    move={editingMove}
                    onClose={() => setEditingMove(null)}
                    onEdit={handleUpdate}
                />
            ) : null}
        </div>
    );
};

export default CardistryContent;
