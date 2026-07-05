import styles from './Pagination.module.scss';

type PaginationProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    onPrev,
    onNext,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return totalPages <= 1 ? null : (
        <div className={styles['pagination-controls']}>
            <button
                className={styles.button}
                type="button"
                disabled={page <= 1}
                onClick={onPrev}
            >
                ←
            </button>
            <span className={styles.indicator}>
                {page} / {totalPages}
            </span>
            <button
                className={styles.button}
                type="button"
                disabled={page >= totalPages}
                onClick={onNext}
            >
                →
            </button>
        </div>
    );
};

export default Pagination;
