'use client';

import { useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/common/Pagination/Pagination';
import { Move } from '@/lib/static/types';
import AddMoveModal from './AddMoveModal/AddMoveModal';
import styles from './CardistryControls.module.scss';

type CardistryControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    onAdd: (move: Move) => void;
};

const CardistryControls: React.FC<CardistryControlsProps> = ({
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
        <div className={styles['cardistry-controls']}>
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
                        Add Move
                    </button>
                ) : null}
                {totalPages > 1 ? (
                    <div className={styles['pagination-wrapper']}>
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPrev={onPrev}
                            onNext={onNext}
                        />
                    </div>
                ) : null}
            </div>
            {isOpen ? (
                <AddMoveModal onClose={() => setIsOpen(false)} onAdd={onAdd} />
            ) : null}
        </div>
    );
};

export default CardistryControls;
