'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import { Key } from '@/lib/static/enums';
import { Game } from '@/lib/static/types';
import styles from './EditGameModal.module.scss';

type EditGameModalProps = {
    game: Game;
    onClose: () => void;
    onEdit: (game: Game) => void;
};

const EditGameModal: React.FC<EditGameModalProps> = ({
    game,
    onClose,
    onEdit,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const RATING_OPTIONS: number[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>(game.name);
    const [genre, setGenre] = useState<string>(game.genre);
    const [icon, setIcon] = useState<string>(game.icon);
    const [rating, setRating] = useState<string>(
        game.rating !== null ? String(game.rating) : '1'
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const trimmedName = name.trim();
        const trimmedGenre = genre.trim();
        const trimmedIcon = icon.trim();
        if (!trimmedName || !trimmedGenre || !trimmedIcon) return;
        const res = await fetch(`/api/games/${game.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: trimmedName,
                genre: trimmedGenre,
                icon: trimmedIcon,
                rating: rating ? parseFloat(rating) : null,
            }),
        });
        if (!res.ok) return;
        onEdit((await res.json()) as Game);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    const handleGenreChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setGenre(e.target.value);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setIcon(e.target.value);
    };

    const handleRatingChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        setRating(e.target.value);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isValid: boolean =
        name.trim().length > 0 &&
        genre.trim().length > 0 &&
        icon.trim().length > 0;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT GAME" onClose={onClose}>
            <div className={styles['edit-game-modal']}>
                <input
                    className={styles.input}
                    value={name}
                    onChange={handleNameChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Game name..."
                    autoFocus
                />
                <input
                    className={styles.input}
                    value={genre}
                    onChange={handleGenreChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Genre..."
                />
                <input
                    className={styles.input}
                    value={icon}
                    onChange={handleIconChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Icon URL..."
                />
                <select
                    className={styles.select}
                    value={rating}
                    onChange={handleRatingChange}
                >
                    {RATING_OPTIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    className={styles.submit}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    Save
                </button>
            </div>
        </Modal>
    );
};

export default EditGameModal;
