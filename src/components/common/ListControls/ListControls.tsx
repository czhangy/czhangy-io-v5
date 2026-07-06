import Link from 'next/link';
import Pagination from '@/components/common/Pagination/Pagination';
import styles from './ListControls.module.scss';

type ListControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
    isAdmin: boolean;
    addLabel: string;
    onAddClick: () => void;
    children?: React.ReactNode;
};

const ListControls: React.FC<ListControlsProps> = ({
    page,
    totalPages,
    onPrev,
    onNext,
    isAdmin,
    addLabel,
    onAddClick,
    children,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['list-controls']}>
            <Link className={styles['back-button']} href="/status">
                ← Back to Status
            </Link>
            <div className={styles.right}>
                {isAdmin ? (
                    <button
                        className={styles['add-button']}
                        type="button"
                        onClick={onAddClick}
                    >
                        {addLabel}
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
            {children}
        </div>
    );
};

export default ListControls;
