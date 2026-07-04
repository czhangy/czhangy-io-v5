'use client';

import { useRef, useState } from 'react';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import PanelSelect from '@/components/status/PanelSelect/PanelSelect';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import LinkIcon from '@/lib/icons/LinkIcon';
import { GAME_GENRES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { Game } from '@/lib/static/types';
import styles from './GamePanel.module.scss';

type GamePanelProps = {
    initialGame: Game | null;
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const GamePanel: React.FC<GamePanelProps> = ({
    initialGame,
    label,
    icon,
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const RATING_OPTIONS: number[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const formRef = useRef<HTMLDivElement>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [game, setGame] = useState<Game | null>(initialGame);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [games, setGames] = useState<Game[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [newGenre, setNewGenre] = useState<string>('');
    const [newIcon, setNewIcon] = useState<string>('');
    const [newRating, setNewRating] = useState<string>('1');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = async (): Promise<void> => {
        setIsEditing(true);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
        setNewRating('1');
        setIsFetching(true);
        const res = await fetch('/api/games');
        if (res.ok) setGames((await res.json()) as Game[]);
        setIsFetching(false);
    };

    const handleCancel = (): void => {
        setIsEditing(false);
        setGames([]);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
        setNewRating('1');
    };

    const handleSelectGame = async (selected: Game): Promise<void> => {
        await fetch('/api/status/game', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: String(selected.id) }),
        });
        setGame(selected);
        setIsEditing(false);
        setGames([]);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
        setNewRating('1');
    };

    const handleSaveNew = async (): Promise<void> => {
        const name = newName.trim();
        const genre = newGenre.trim();
        const icon = newIcon.trim();
        if (!name || !genre || !icon) return;
        setIsSaving(true);
        const res = await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                genre,
                icon,
                rating: parseFloat(newRating),
            }),
        });
        if (!res.ok) {
            setIsSaving(false);
            return;
        }
        const created = (await res.json()) as Game;
        await fetch('/api/status/game', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: String(created.id) }),
        });
        setGame(created);
        setIsEditing(false);
        setGames([]);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
        setNewRating('1');
        setIsSaving(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewName(e.target.value);
    };

    const handleNameFocus = (): void => {
        setShowDropdown(true);
    };

    const handleNameBlur = (): void => {
        setShowDropdown(false);
    };

    const handleGenreChange = (value: string): void => {
        setNewGenre(value);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewIcon(e.target.value);
    };

    const handleRatingChange = (value: string): void => {
        setNewRating(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === Key.Escape) {
            if (showDropdown) {
                setShowDropdown(false);
                return;
            }
            handleCancel();
        }
        if (e.key === Key.Enter) handleSaveNew();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const headerActions: React.ReactNode = (
        <>
            <PanelButton href="/status/games" icon={<LinkIcon />} />
            {isAdmin ? (
                <PanelButton onClick={handleEdit} disabled={isEditing} />
            ) : null}
        </>
    );

    const filteredGames: Game[] = games.filter((g) =>
        g.name.toLowerCase().includes(newName.toLowerCase())
    );

    const canSave: boolean =
        !!newName.trim() && !!newGenre.trim() && !!newIcon.trim();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={headerActions}
        >
            {isEditing ? (
                <div
                    ref={formRef}
                    className={styles['edit-form']}
                    onKeyDown={handleKeyDown}
                >
                    <div className={styles['top-row']}>
                        <div className={styles['name-wrapper']}>
                            <input
                                className={styles['name-input']}
                                value={newName}
                                onChange={handleNameChange}
                                onFocus={handleNameFocus}
                                onBlur={handleNameBlur}
                                placeholder="Game name..."
                                autoFocus
                            />
                            {isFetching ? (
                                <span className={styles.spinner} />
                            ) : showDropdown && filteredGames.length > 0 ? (
                                <ul className={styles.dropdown}>
                                    {filteredGames.map((g) => (
                                        <li
                                            key={g.id}
                                            className={styles['dropdown-item']}
                                            onMouseDown={(
                                                e: React.MouseEvent
                                            ) => e.preventDefault()}
                                            onClick={() => handleSelectGame(g)}
                                        >
                                            <span
                                                className={styles['item-name']}
                                            >
                                                {g.name}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </div>
                        <PanelSelect
                            options={RATING_OPTIONS}
                            value={newRating}
                            onChange={handleRatingChange}
                            compact
                        />
                    </div>
                    <div className={styles.row}>
                        <PanelSelect
                            options={GAME_GENRES}
                            value={newGenre}
                            onChange={handleGenreChange}
                            placeholder="Genre"
                        />
                        <input
                            className={styles['field-input']}
                            value={newIcon}
                            onChange={handleIconChange}
                            placeholder="Icon URL"
                        />
                    </div>
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles['save-btn']}
                            onClick={handleSaveNew}
                            disabled={isSaving || !canSave}
                        >
                            SAVE
                        </button>
                        <button
                            type="button"
                            className={styles['cancel-btn']}
                            onClick={handleCancel}
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    {game ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={styles.icon}
                                src={game.icon}
                                alt={`${game.name} icon`}
                                width={56}
                                height={56}
                            />
                            <div className={styles.info}>
                                <span className={styles.name}>{game.name}</span>
                                <span className={styles['genre-tag']}>
                                    {game.genre}
                                </span>
                            </div>
                        </>
                    ) : (
                        <span className={styles.empty}>—</span>
                    )}
                </div>
            )}
        </StatusPanel>
    );
};

export default GamePanel;
