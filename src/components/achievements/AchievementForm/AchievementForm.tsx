'use client';

import { useState } from 'react';
import styles from './AchievementForm.module.scss';

export type AchievementFormValues = {
    tier: number;
    name: string;
    category: string;
    description: string;
    date: string;
};

type AchievementFormProps = {
    submitLabel: string;
    initialValues?: Partial<AchievementFormValues>;
    onSubmit: (values: AchievementFormValues) => Promise<void>;
    onCancel: () => void;
};

const AchievementForm: React.FC<AchievementFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
    onCancel,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const CATEGORIES: string[] = [
        'Career',
        'Gaming',
        'Hobbies',
        'Life',
        'Misc',
        'Travel',
    ];
    const TIER_OPTIONS: number[] = [1, 2, 3];

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [tier, setTier] = useState<number>(initialValues?.tier ?? 0);
    const [name, setName] = useState<string>(initialValues?.name ?? '');
    const [category, setCategory] = useState<string>(
        initialValues?.category ?? ''
    );
    const [description, setDescription] = useState<string>(
        initialValues?.description ?? ''
    );
    const [date, setDate] = useState<string>(initialValues?.date ?? '');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError('');
        try {
            await onSubmit({ tier, name, category, description, date });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsSubmitting(false);
        }
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const validate = (): string => {
        if (!name.trim()) return 'Name is required.';
        if (name.trim().length > 24)
            return 'Name must be 24 characters or fewer.';
        if (!date.trim()) return 'Date is required.';
        if (
            !/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(date.trim())
        )
            return 'Date must be in MM/DD/YYYY format.';
        if (tier === 0) return 'Tier is required.';
        if (!category) return 'Category is required.';
        if (!description.trim()) return 'Description is required.';
        if (!/^[A-Z]/.test(description.trim()))
            return 'Description must start with a capital letter.';
        if (!/[.!?]$/.test(description.trim()))
            return 'Description must end with punctuation (., !, or ?).';
        return '';
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={`${styles.row} ${styles['row--wide-first']}`}>
                <div className={styles.field}>
                    <span className={styles.label}>Name</span>
                    <input
                        className={styles.input}
                        maxLength={24}
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                        }
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>Date</span>
                    <input
                        className={styles.input}
                        placeholder="MM/DD/YYYY"
                        value={date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setDate(e.target.value)
                        }
                    />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.field}>
                    <span className={styles.label}>Tier</span>
                    <select
                        className={styles.select}
                        value={tier}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setTier(Number(e.target.value))
                        }
                    >
                        <option value={0} disabled>
                            —
                        </option>
                        {TIER_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>Category</span>
                    <select
                        className={styles.select}
                        value={category}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            setCategory(e.target.value)
                        }
                    >
                        <option value="" disabled>
                            —
                        </option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={styles.field}>
                <span className={styles.label}>Description</span>
                <textarea
                    className={styles.textarea}
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setDescription(e.target.value)
                    }
                />
            </div>
            {error ? <span className={styles.error}>{error}</span> : null}
            <div className={styles.actions}>
                <button
                    className={styles['cancel-button']}
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className={styles['submit-button']}
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
};

export default AchievementForm;
