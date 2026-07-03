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
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (move: CardistryMoveEntry): void => {
        setMoves((prev) => {
            const filtered = prev.filter((m) => m.id !== move.id);
            return [...filtered, move].sort((a, b) =>
                a.name.localeCompare(b.name)
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
                {paginatedMoves.map((move) => (
                    <li key={move.id} className={styles.item}>
                        <span className={styles.name}>{move.name}</span>
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
        </div>
    );
};

export default CardistryContent;
