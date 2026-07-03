'use client';

import { useState } from 'react';
import Link from 'next/link';
import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import { WatchedMediaEntry } from '@/lib/static/types';
import AddContentModal from './AddContentModal/AddContentModal';
import styles from './WatchedControls.module.scss';

type WatchedControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    onAdd: (entry: WatchedMediaEntry) => void;
};

const WatchedControls: React.FC<WatchedControlsProps> = ({
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
        <div className={styles['watched-controls']}>
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
                        Add Content
                    </button>
                ) : null}
                {isOpen ? (
                    <AddContentModal
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

export default WatchedControls;
