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
                        Add Book
                    </button>
                ) : null}
                {isOpen ? (
                    <AddBookModal
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

export default LibraryControls;
