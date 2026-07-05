'use client';

import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import Modal from '@/components/common/Modal/Modal';
import { GAME_GENRES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { Game } from '@/lib/static/types';
import styles from './AddGameModal.module.scss';

type AddGameModalProps = {
    onClose: () => void;
    onAdd: (game: Game) => void;
};

const AddGameModal: React.FC<AddGameModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const RATING_OPTIONS: string[] = [
        '1',
        '1.5',
        '2',
        '2.5',
        '3',
        '3.5',
        '4',
        '4.5',
        '5',
    ];

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [icon, setIcon] = useState<string>('');
    const [rating, setRating] = useState<string>('1');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const trimmedName = name.trim();
        const trimmedGenre = genre.trim();
        const trimmedIcon = icon.trim();
        if (!trimmedName || !trimmedGenre || !trimmedIcon) return;
        const res = await fetch('/api/games', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: trimmedName,
                genre: trimmedGenre,
                icon: trimmedIcon,
                rating: rating ? parseFloat(rating) : null,
            }),
        });
        if (!res.ok) return;
        onAdd((await res.json()) as Game);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    const handleGenreChange = (value: string): void => {
        setGenre(value);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setIcon(e.target.value);
    };

    const handleRatingChange = (value: string): void => {
        setRating(value);
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
        <Modal title="ADD GAME" onClose={onClose}>
            <div className={styles['add-game-modal']}>
                <div className={styles.field}>
                    <span className={styles.label}>Name</span>
                    <input
                        className={styles.input}
                        value={name}
                        onChange={handleNameChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                </div>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <span className={styles.label}>Genre</span>
                        <Dropdown
                            value={genre}
                            onChange={handleGenreChange}
                            options={GAME_GENRES}
                        />
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>Icon URL</span>
                        <input
                            className={styles.input}
                            value={icon}
                            onChange={handleIconChange}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>Rating</span>
                    <Dropdown
                        value={rating}
                        onChange={handleRatingChange}
                        options={RATING_OPTIONS}
                    />
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submit}
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddGameModal;
