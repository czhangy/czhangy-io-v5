'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import { Key } from '@/lib/static/enums';
import { Game } from '@/lib/static/types';
import styles from './AddGameModal.module.scss';

type AddGameModalProps = {
    onClose: () => void;
    onAdd: (game: Game) => void;
};

const AddGameModal: React.FC<AddGameModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>('');
    const [genre, setGenre] = useState<string>('');
    const [icon, setIcon] = useState<string>('');

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

    const handleGenreChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setGenre(e.target.value);
    };

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setIcon(e.target.value);
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
                <button
                    type="button"
                    className={styles.submit}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    Add
                </button>
            </div>
        </Modal>
    );
};

export default AddGameModal;
