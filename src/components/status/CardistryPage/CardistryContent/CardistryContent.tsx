'use client';

import { useState } from 'react';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import { CardistryMoveEntry } from '@/lib/static/types';
import CardistryHelpers from '@/lib/utils/CardistryHelpers';
import styles from './CardistryContent.module.scss';
import CardistryControls from './CardistryControls/CardistryControls';
import EditMoveModal from './EditMoveModal/EditMoveModal';

type CardistryContentProps = {
    initialMoves: CardistryMoveEntry[];
};

const CardistryContent: React.FC<CardistryContentProps> = ({
    initialMoves,
}) => {
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

    const [moves, setMoves] = useState<CardistryMoveEntry[]>(initialMoves);
    const [page, setPage] = useState<number>(1);
    const [editingMove, setEditingMove] = useState<CardistryMoveEntry | null>(
        null
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (move: CardistryMoveEntry): void => {
        setMoves((prev) => {
            const filtered = prev.filter((m) => m.id !== move.id);
            return [...filtered, move].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
        });
        setPage(1);
    };

    const handleUpdate = (updated: CardistryMoveEntry): void => {
        setMoves((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
        );
        setEditingMove(null);
    };

    const handleDelete = async (id: number): Promise<void> => {
        const res = await fetch(`/api/cardistry/${id}`, { method: 'DELETE' });
        if (!res.ok) return;
        const nextMoves = moves.filter((m) => m.id !== id);
        const newTotalPages = Math.max(
            1,
            Math.ceil(nextMoves.length / ITEMS_PER_PAGE)
        );
        setMoves(nextMoves);
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
        Math.ceil(moves.length / ITEMS_PER_PAGE)
    );

    const paginatedMoves: CardistryMoveEntry[] = moves.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['cardistry-content']}>
            <CardistryControls
                page={page}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
                isAdmin={isAdmin}
                onAdd={handleAdd}
            />
            <ul className={styles.list}>
                {paginatedMoves.map((move) => {
                    const proficiency = CardistryHelpers.getProficiency(
                        move.count
                    );
                    return (
                        <li key={move.id} className={styles.item}>
                            <div className={styles.proficiency}>
                                <div className={styles.pips}>
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className={`${styles.pip}${i < proficiency.tier ? ` ${styles['pip--filled']}` : ''}`}
                                        />
                                    ))}
                                </div>
                                <span className={styles.count}>
                                    {proficiency.display}
                                </span>
                            </div>
                            <div className={styles.details}>
                                <span className={styles.name}>{move.name}</span>
                                <div className={styles.metadata}>
                                    <span className={styles['type-tag']}>
                                        {move.type}
                                    </span>
                                </div>
                            </div>
                            {isAdmin ? (
                                <div className={styles['admin-actions']}>
                                    <button
                                        type="button"
                                        className={styles['action-button']}
                                        onClick={() => setEditingMove(move)}
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles['action-button']}
                                        onClick={() => handleDelete(move.id)}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
            <div className={styles.pagination}>
                <PaginationControls
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
