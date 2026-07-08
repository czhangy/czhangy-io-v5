'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import { CARDISTRY_MOVE_TYPES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { Move } from '@/lib/static/types';
import StringHelpers from '@/lib/utils/StringHelpers';
import styles from './MoveForm.module.scss';

type MoveFormProps = {
    submitLabel: string;
    initialValues?: Partial<Move>;
    onSubmit: (values: {
        name: string;
        type: string;
        count?: number;
    }) => Promise<void>;
    onClose: () => void;
};

const MoveForm: React.FC<MoveFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
    onClose,
}) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>(initialValues?.name ?? '');
    const [type, setType] = useState<string>(initialValues?.type ?? '');
    const [count, setCount] = useState<string>(
        initialValues?.count !== undefined ? String(initialValues.count) : '0'
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
                type,
                ...(isEditing ? { count: parseInt(count, 10) } : {}),
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
        if (!StringHelpers.isTitleCase(name.trim()))
            return 'Name must be title case.';
        if (!type) return 'Type is required.';
        if (isEditing && !/^\d+$/.test(count.trim()))
            return 'Count must be a non-negative integer.';
        return '';
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isEditing: boolean = initialValues?.count !== undefined;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['move-form']}>
            <div className={styles.row}>
                <FormField
                    label="Name"
                    value={name}
                    onChange={setName}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <FormField
                    label="Type"
                    value={type}
                    onChange={setType}
                    options={CARDISTRY_MOVE_TYPES}
                />
            </div>
            {isEditing ? (
                <FormField
                    label="Count"
                    value={count}
                    onChange={setCount}
                    onKeyDown={handleKeyDown}
                />
            ) : null}
            {error ? <span className={styles.error}>{error}</span> : null}
            <AddButton
                label={isSubmitting ? 'Saving...' : submitLabel}
                disabled={isSubmitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default MoveForm;
