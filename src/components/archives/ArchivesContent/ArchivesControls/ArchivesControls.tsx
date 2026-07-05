'use client';

import { useState } from 'react';
import Link from 'next/link';
import Pagination from '@/components/common/Pagination/Pagination';
import { Content } from '@/lib/static/types';
import AddContentModal from './AddContentModal/AddContentModal';
import styles from './ArchivesControls.module.scss';

type ArchivesControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    onAdd: (entry: Content) => void;
};

const ArchivesControls: React.FC<ArchivesControlsProps> = ({
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
        <div className={styles['archives-controls']}>
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
                        Add Content
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
                <AddContentModal
                    onClose={() => setIsOpen(false)}
                    onAdd={onAdd}
                />
            ) : null}
        </div>
    );
};

export default ArchivesControls;
