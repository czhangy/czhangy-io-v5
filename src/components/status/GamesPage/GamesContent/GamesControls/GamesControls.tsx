'use client';

import { useState } from 'react';
import Link from 'next/link';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { Game } from '@/lib/static/types';
import AddGameModal from './AddGameModal/AddGameModal';
import styles from './GamesControls.module.scss';

type GamesControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    onAdd: (game: Game) => void;
};

const GamesControls: React.FC<GamesControlsProps> = ({
    page,
    totalPages,
    onPrev,
    onNext,
    isAdmin,
    onAdd,
}) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isOpen, setIsOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['games-controls']}>
            <Link className={styles['back-button']} href="/status">
                ← Back to Status
            </Link>
            <div className={styles.right}>
                {isAdmin ? (
                    <button
                        className={styles['add-button']}
                        type="button"
                        onClick={() => setIsOpen(true)}
                    >
                        Add Game
                    </button>
                ) : null}
                {totalPages > 1 ? (
                    <div className={styles['pagination-wrapper']}>
                        <PaginationControls
                            page={page}
                            totalPages={totalPages}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    </div>
                ) : null}
            </div>
            {isOpen ? (
                <AddGameModal onClose={() => setIsOpen(false)} onAdd={onAdd} />
            ) : null}
        </div>
    );
};

export default GamesControls;
