import styles from './PaginationControls.module.scss';

type PaginationControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

const PaginationControls: React.FC<PaginationControlsProps> = ({
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

export default PaginationControls;
