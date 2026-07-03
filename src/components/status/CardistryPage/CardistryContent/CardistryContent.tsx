'use client';

import { useState } from 'react';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { useSession } from '@/lib/context/SessionContext';
import { CardistryMoveEntry } from '@/lib/static/types';
import styles from './CardistryContent.module.scss';
import CardistryControls from './CardistryControls/CardistryControls';

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

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const getProficiency = (
        count: number
    ): { display: string; tier: number } => {
        if (count >= 10000) return { display: '10000/10000', tier: 3 };
        if (count >= 1000) return { display: `${count}/10000`, tier: 2 };
        if (count >= 100) return { display: `${count}/1000`, tier: 1 };
        return { display: `${count}/100`, tier: 0 };
    };

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
                    const proficiency = getProficiency(move.count);
                    return (
                        <li key={move.id} className={styles.item}>
                            <div className={styles.left}>
                                <span className={styles.name}>{move.name}</span>
                                <div className={styles.metadata}>
                                    <span className={styles['type-tag']}>
                                        {move.type}
                                    </span>
                                </div>
                            </div>
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
        </div>
    );
};

export default CardistryContent;
