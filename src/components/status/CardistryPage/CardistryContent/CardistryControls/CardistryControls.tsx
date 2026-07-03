'use client';

import { useState } from 'react';
import Link from 'next/link';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { CardistryMoveEntry } from '@/lib/static/types';
import AddMoveModal from './AddMoveModal/AddMoveModal';
import styles from './CardistryControls.module.scss';

type CardistryControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    onAdd: (move: CardistryMoveEntry) => void;
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
            <div className={styles.left}>
                <Link className={styles['back-button']} href="/status">
                    ← Back to Status
                </Link>
            </div>
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
                {isOpen ? (
                    <AddMoveModal
                        onClose={() => setIsOpen(false)}
                        onAdd={onAdd}
                    />
                ) : null}
                <PaginationControls
                    page={page}
                    totalPages={totalPages}
                    onPrev={onPrev}
                    onNext={onNext}
                />
            </div>
        </div>
    );
};

export default CardistryControls;
