import AdminActions from '@/components/common/AdminActions/AdminActions';
import HighlightMatch from '@/components/common/HighlightMatch/HighlightMatch';
import { Move } from '@/lib/static/types';
import CardistryHelpers from '@/lib/utils/CardistryHelpers';
import styles from './MoveListItem.module.scss';

type MoveListItemProps = {
    move: Move;
    searchQuery: string;
    isAdmin: boolean;
    isIncrementing: boolean;
    onIncrement: (amount: number) => void;
    onEdit: () => void;
    onDelete: () => void;
    highlightLabel?: string;
};

const MoveListItem: React.FC<MoveListItemProps> = ({
    move,
    searchQuery,
    isAdmin,
    isIncrementing,
    onIncrement,
    onEdit,
    onDelete,
    highlightLabel,
}) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const proficiency = CardistryHelpers.getProficiency(move.count);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <li
            className={`${styles.item}${highlightLabel ? ` ${styles['item--highlighted']}` : ''}`}
        >
            {highlightLabel ? (
                <div className={styles['item-header']}>
                    <span className={styles['item-label']}>
                        {highlightLabel}
                    </span>
                </div>
            ) : null}
            <div className={styles['item-body']}>
                <div className={styles.proficiency}>
                    <div className={styles.pips}>
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className={`${styles.pip}${i < proficiency.tier ? ` ${styles['pip--filled']}` : ''}`}
                            />
                        ))}
                    </div>
                    <span className={styles.count}>{proficiency.display}</span>
                </div>
                <div className={styles.details}>
                    <a
                        className={styles.name}
                        href={move.tutorial}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <HighlightMatch text={move.name} query={searchQuery} />
                    </a>
                    <div className={styles.metadata}>
                        <span className={styles['type-tag']}>{move.type}</span>
                    </div>
                </div>
                {isAdmin ? (
                    <>
                        <div className={styles['increment-buttons']}>
                            {[1, 10, 25].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    className={styles['increment-btn']}
                                    disabled={isIncrementing}
                                    onClick={() => onIncrement(amount)}
                                >
                                    +{amount}
                                </button>
                            ))}
                        </div>
                        <AdminActions
                            className={styles['admin-actions']}
                            entryName={move.name}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </>
                ) : null}
            </div>
        </li>
    );
};

export default MoveListItem;
