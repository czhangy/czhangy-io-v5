import { useState } from 'react';
import AdminActions from '@/components/common/AdminActions/AdminActions';
import HighlightMatch from '@/components/common/HighlightMatch/HighlightMatch';
import { Move } from '@/lib/static/types';
import CardistryHelpers from '@/lib/utils/CardistryHelpers';
import styles from './MoveListItem.module.scss';
import RoutineNotesModal from './RoutineNotesModal/RoutineNotesModal';

type MoveListItemProps = {
    move: Move;
    searchQuery: string;
    isAdmin: boolean;
    isIncrementing: boolean;
    onIncrement: (amount: number) => void;
    onHighlight?: () => void;
    onEdit: () => void;
    onDelete: () => void;
    highlighted?: boolean;
};

const MoveListItem: React.FC<MoveListItemProps> = ({
    move,
    searchQuery,
    isAdmin,
    isIncrementing,
    onIncrement,
    onHighlight,
    onEdit,
    onDelete,
    highlighted,
}) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleNotesOpen = (): void => {
        setIsNotesOpen(true);
    };

    const handleNotesClose = (): void => {
        setIsNotesOpen(false);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const proficiency = CardistryHelpers.getProficiency(move.count);
    const isRoutine: boolean = CardistryHelpers.isRoutine(move.type);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <li
            className={`${styles.item}${highlighted ? ` ${styles['item--highlighted']}` : ''}`}
        >
            <div className={styles['item-body']}>
                <div className={styles['top-row']}>
                    {isRoutine ? null : (
                        <div className={styles.proficiency}>
                            <div className={styles.pips}>
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className={`${styles.pip}${i < proficiency.tier ? ` ${styles['pip--filled']}` : ''}`}
                                    />
                                ))}
                            </div>
                            <span className={styles.count}>
                                {proficiency.display}
                            </span>
                        </div>
                    )}
                    <span className={styles['type-tag']}>
                        {CardistryHelpers.getTypeLabel(move.type)}
                    </span>
                </div>
                <div className={styles.details}>
                    {isRoutine && isAdmin ? (
                        <button
                            type="button"
                            className={`${styles.name} ${styles['name--button']}`}
                            onClick={handleNotesOpen}
                        >
                            <HighlightMatch
                                text={move.name}
                                query={searchQuery}
                            />
                        </button>
                    ) : !isRoutine && move.tutorial ? (
                        <a
                            className={styles.name}
                            href={move.tutorial}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <HighlightMatch
                                text={move.name}
                                query={searchQuery}
                            />
                        </a>
                    ) : (
                        <span className={styles.name}>
                            <HighlightMatch
                                text={move.name}
                                query={searchQuery}
                            />
                        </span>
                    )}
                </div>
                {isAdmin ? (
                    <div className={styles['admin-section']}>
                        {isRoutine ? null : (
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
                        )}
                        <AdminActions
                            className={styles['admin-actions']}
                            entryName={move.name}
                            onHighlight={onHighlight}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                ) : null}
            </div>
            {isNotesOpen && isAdmin ? (
                <RoutineNotesModal
                    name={move.name}
                    notes={move.notes}
                    onClose={handleNotesClose}
                />
            ) : null}
        </li>
    );
};

export default MoveListItem;
