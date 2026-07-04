'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import { Key } from '@/lib/static/enums';
import { Game, GameEntry, RAWGGame } from '@/lib/static/types';
import styles from './GamePanel.module.scss';

type GamePanelProps = {
    initialEntry: GameEntry;
    initialMeta: RAWGGame | null;
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const GamePanel: React.FC<GamePanelProps> = ({
    initialEntry,
    initialMeta,
    label,
    icon,
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const formRef = useRef<HTMLDivElement>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entry, setEntry] = useState<GameEntry>(initialEntry);
    const [meta, setMeta] = useState<RAWGGame | null>(initialMeta);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [games, setGames] = useState<Game[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [newGenre, setNewGenre] = useState<string>('');
    const [newIcon, setNewIcon] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = async (): Promise<void> => {
        setIsEditing(true);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
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
    };

    const handleSelectGame = async (game: Game): Promise<void> => {
        const newEntry: GameEntry = { name: game.name, rawgId: game.id };
        await fetch('/api/status/game', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntry) }),
        });
        setEntry(newEntry);
        setMeta({ cover: game.icon, genres: [game.genre] });
        setIsEditing(false);
        setGames([]);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
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
            body: JSON.stringify({ name, genre, icon }),
        });
        if (!res.ok) {
            setIsSaving(false);
            return;
        }
        const game = (await res.json()) as Game;
        const newEntry: GameEntry = { name: game.name, rawgId: game.id };
        await fetch('/api/status/game', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntry) }),
        });
        setEntry(newEntry);
        setMeta({ cover: game.icon, genres: [game.genre] });
        setIsEditing(false);
        setGames([]);
        setNewName('');
        setNewGenre('');
        setNewIcon('');
        setIsSaving(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewName(e.target.value);
    };

    const handleGenreChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setNewGenre(e.target.value);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewIcon(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === Key.Escape) handleCancel();
        if (e.key === Key.Enter) handleSaveNew();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const editButton: React.ReactNode = isAdmin ? (
        <PanelButton onClick={handleEdit} disabled={isEditing} />
    ) : null;

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
            headerAction={editButton}
        >
            {isEditing ? (
                <div
                    ref={formRef}
                    className={styles['edit-form']}
                    onKeyDown={handleKeyDown}
                >
                    <div className={styles['name-wrapper']}>
                        <input
                            className={styles['name-input']}
                            value={newName}
                            onChange={handleNameChange}
                            placeholder="Game name..."
                            autoFocus
                        />
                        {isFetching ? (
                            <span className={styles.spinner} />
                        ) : filteredGames.length > 0 ? (
                            <ul className={styles.dropdown}>
                                {filteredGames.map((g) => (
                                    <li
                                        key={g.id}
                                        className={styles['dropdown-item']}
                                        onMouseDown={(e: React.MouseEvent) =>
                                            e.preventDefault()
                                        }
                                        onClick={() => handleSelectGame(g)}
                                    >
                                        <span className={styles['item-name']}>
                                            {g.name}
                                        </span>
                                        <span className={styles['item-genre']}>
                                            {g.genre}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                    <div className={styles.row}>
                        <input
                            className={styles['field-input']}
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
                    <Image
                        className={
                            meta?.cover
                                ? styles.cover
                                : styles['cover--fallback']
                        }
                        src={meta?.cover ?? '/game.png'}
                        alt={`${entry.name} cover`}
                        width={90}
                        height={56}
                    />
                    <div className={styles.info}>
                        <span className={styles.name}>{entry.name}</span>
                        {meta?.genres && meta.genres.length > 0 ? (
                            <div className={styles.genres}>
                                {meta.genres.slice(0, 2).map((g) => (
                                    <span
                                        key={g}
                                        className={styles['genre-tag']}
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </StatusPanel>
    );
};

export default GamePanel;
