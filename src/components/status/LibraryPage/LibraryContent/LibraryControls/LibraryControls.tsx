'use client';

import { useState } from 'react';
import Link from 'next/link';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { ReadMediaEntry } from '@/lib/static/types';
import AddBookModal from './AddBookModal/AddBookModal';
import styles from './LibraryControls.module.scss';

type LibraryControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    onAdd: (entry: ReadMediaEntry) => void;
};

const LibraryControls: React.FC<LibraryControlsProps> = ({
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
        <div className={styles['library-controls']}>
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
                        Add Book
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
                <AddBookModal onClose={() => setIsOpen(false)} onAdd={onAdd} />
            ) : null}
        </div>
    );
};

export default LibraryControls;
