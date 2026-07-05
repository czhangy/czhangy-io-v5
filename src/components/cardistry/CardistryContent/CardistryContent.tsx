'use client';

import { useState } from 'react';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSession } from '@/lib/context/SessionContext';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import { Move } from '@/lib/static/types';
import CardistryHelpers from '@/lib/utils/CardistryHelpers';
import styles from './CardistryContent.module.scss';
import CardistryControls from './CardistryControls/CardistryControls';
import EditMoveModal from './EditMoveModal/EditMoveModal';

type CardistryContentProps = {
    initialMoves: Move[];
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

    const [moves, setMoves] = useState<Move[]>(initialMoves);
    const [page, setPage] = useState<number>(1);
    const [editingMove, setEditingMove] = useState<Move | null>(null);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (move: Move): void => {
        setMoves((prev) => {
            const filtered = prev.filter((m) => m.name !== move.name);
            return [...filtered, move].sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );
        });
        setPage(1);
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
        const res = await fetch(
            `/api/cardistry/${encodeURIComponent(move.name)}`,
            {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: move.name,
                    type: move.type,
                    count: move.count + amount,
                }),
            }
        );
        if (!res.ok) return;
        const updated = (await res.json()) as Move;
        setMoves((prev) =>
            prev.map((m) => (m.name === updated.name ? updated : m))
        );
    };

    const handleDelete = async (name: string): Promise<void> => {
        const res = await fetch(`/api/cardistry/${encodeURIComponent(name)}`, {
            method: 'DELETE',
        });
        if (!res.ok) return;
        const nextMoves = moves.filter((m) => m.name !== name);
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

    const paginatedMoves: Move[] = moves.slice(
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
                        <li key={move.name} className={styles.item}>
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
                                <>
                                    <div
                                        className={styles['increment-buttons']}
                                    >
                                        {[1, 10, 25, 50].map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                className={
                                                    styles['increment-btn']
                                                }
                                                onClick={() =>
                                                    handleIncrement(
                                                        move,
                                                        amount
                                                    )
                                                }
                                            >
                                                +{amount}
                                            </button>
                                        ))}
                                    </div>
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
                                            onClick={() =>
                                                handleDelete(move.name)
                                            }
                                        >
                                            <DeleteIcon />
                                        </button>
                                    </div>
                                </>
                            ) : null}
                        </li>
                    );
                })}
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
