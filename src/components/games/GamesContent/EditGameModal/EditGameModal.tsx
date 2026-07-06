'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import Modal from '@/components/common/Modal/Modal';
import { GAME_GENRES } from '@/lib/static/constants';
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
        const res = await fetch(`/api/games/${encodeURIComponent(game.name)}`, {
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
                <FormField
                    label="Name"
                    value={name}
                    onChange={setName}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className={styles.row}>
                    <FormField
                        label="Genre"
                        value={genre}
                        onChange={setGenre}
                        options={GAME_GENRES}
                    />
                    <FormField
                        label="Icon URL"
                        value={icon}
                        onChange={setIcon}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <FormField
                    label="Rating"
                    value={rating}
                    onChange={setRating}
                    options={RATING_OPTIONS}
                />
                <AddButton
                    label="Save"
                    disabled={!isValid}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );
};

export default EditGameModal;
