'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import { GAME_GENRES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { Game } from '@/lib/static/types';
import styles from './GameForm.module.scss';

type GameFormProps = {
    submitLabel: string;
    initialValues?: Partial<Game>;
    onSubmit: (values: Game) => Promise<void>;
    onClose: () => void;
};

const GameForm: React.FC<GameFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
    onClose,
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

    const [name, setName] = useState<string>(initialValues?.name ?? '');
    const [genre, setGenre] = useState<string>(initialValues?.genre ?? '');
    const [icon, setIcon] = useState<string>(initialValues?.icon ?? '');
    const [rating, setRating] = useState<string>(
        initialValues?.rating !== undefined ? String(initialValues.rating) : '1'
    );
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await onSubmit({
                name: name.trim(),
                genre: genre.trim(),
                icon: icon.trim(),
                rating: parseFloat(rating),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const validate = (): string => {
        if (!name.trim()) return 'Name is required.';
        if (!genre.trim()) return 'Genre is required.';
        if (!icon.trim()) return 'Icon is required.';
        return '';
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['game-form']}>
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
            {error ? <span className={styles.error}>{error}</span> : null}
            <AddButton
                label={isSubmitting ? 'Saving...' : submitLabel}
                disabled={isSubmitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default GameForm;
