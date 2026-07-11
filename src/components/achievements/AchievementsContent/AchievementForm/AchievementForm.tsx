'use client';

import { useState } from 'react';
import DatePicker from '@/components/common/DatePicker/DatePicker';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import { CreateAchievementParams } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import styles from './AchievementForm.module.scss';

type AchievementFormProps = {
    submitLabel: string;
    initialValues?: Partial<CreateAchievementParams>;
    onSubmit: (values: CreateAchievementParams) => Promise<void>;
};

const AchievementForm: React.FC<AchievementFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const TODAY: string = DateHelpers.getTodayString();

    const CATEGORIES: string[] = [
        'Career',
        'Gaming',
        'Hobbies',
        'Life',
        'Misc',
        'Travel',
    ];
    const TIER_OPTIONS: string[] = ['1', '2', '3'];

    const MAX_NAME_LENGTH: number = 30;

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
    const [date, setDate] = useState<string>(initialValues?.date ?? TODAY);
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
            await onSubmit({
                tier,
                name,
                category,
                description,
                date: DateHelpers.getMMDDYYYY(date.trim()),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setIsSubmitting(false);
        }
    };

    const handleTierChange = (value: string): void => {
        setTier(Number(value));
    };

    const handleCategoryChange = (value: string): void => {
        setCategory(value);
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const validate = (): string => {
        if (!name.trim()) return 'Name is required.';
        if (name.trim().length > MAX_NAME_LENGTH)
            return `Name must be ${MAX_NAME_LENGTH} characters or fewer.`;

        const dateStr = date.trim();
        if (!dateStr) return 'Date is required.';
        const parsed = DateHelpers.getDateObject(dateStr);
        if (!parsed) return 'Date has incorrect format.';
        if (parsed.getFullYear() < 2019) return 'Date is too early.';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (parsed > today) return 'Date is in the future.';

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
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setName(e.target.value)
                        }
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>Date</span>
                    <DatePicker value={date} onChange={setDate} />
                </div>
            </div>
            <div className={styles.row}>
                <div className={styles.field}>
                    <span className={styles.label}>Tier</span>
                    <Dropdown
                        value={tier === 0 ? '' : String(tier)}
                        onChange={handleTierChange}
                        options={TIER_OPTIONS}
                    />
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>Category</span>
                    <Dropdown
                        value={category}
                        onChange={handleCategoryChange}
                        options={CATEGORIES}
                    />
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
