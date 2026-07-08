import AdminActions from '@/components/common/AdminActions/AdminActions';
import HighlightMatch from '@/components/common/HighlightMatch/HighlightMatch';
import { Game } from '@/lib/static/types';
import styles from './GameListItem.module.scss';

type GameListItemProps = {
    game: Game;
    searchQuery: string;
    isAdmin: boolean;
    onEdit: () => void;
    onDelete: () => void;
    highlightLabel?: string;
};

const GameListItem: React.FC<GameListItemProps> = ({
    game,
    searchQuery,
    isAdmin,
    onEdit,
    onDelete,
    highlightLabel,
}) => {
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
                <div className={styles['icon-wrapper']}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className={styles.icon}
                        src={game.icon}
                        alt={`${game.name} icon`}
                        width={64}
                        height={64}
                    />
                </div>
                <div className={styles.details}>
                    <span className={styles.name}>
                        <HighlightMatch text={game.name} query={searchQuery} />
                    </span>
                    <div className={styles.metadata}>
                        <span className={styles['genre-tag']}>
                            {game.genre}
                        </span>
                    </div>
                    <div className={styles.rating}>
                        {[1, 2, 3, 4, 5].map((i) => {
                            const isFull = game.rating >= i;
                            const isHalf = !isFull && game.rating >= i - 0.5;
                            return (
                                <span
                                    key={i}
                                    className={`${styles.star}${isFull ? ` ${styles['star--full']}` : isHalf ? ` ${styles['star--half']}` : ''}`}
                                >
                                    ★
                                </span>
                            );
                        })}
                    </div>
                </div>
                {isAdmin ? (
                    <AdminActions
                        entryName={game.name}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ) : null}
            </div>
        </li>
    );
};

export default GameListItem;
