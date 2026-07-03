import PaginationControls from '@/components/common/PaginationControls/PaginationControls';
import styles from './WatchedControls.module.scss';

type WatchedControlsProps = {
    page: number;
    totalPages: number;
    onPrev: () => void;
    onNext: () => void;
};

const WatchedControls: React.FC<WatchedControlsProps> = ({
    page,
    totalPages,
    onPrev,
    onNext,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['watched-controls']}>
            <PaginationControls
                page={page}
                totalPages={totalPages}
                onPrev={onPrev}
                onNext={onNext}
            />
        </div>
    );
};

export default WatchedControls;
