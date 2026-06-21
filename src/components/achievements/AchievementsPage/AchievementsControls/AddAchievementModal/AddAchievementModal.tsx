'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '@/components/common/Modal/Modal';
import styles from './AddAchievementModal.module.scss';

type AddAchievementModalProps = {
    onClose: () => void;
};

const AddAchievementModal: React.FC<AddAchievementModalProps> = ({
    onClose,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const CATEGORIES: string[] = ['Life', 'Career', 'Gaming'];
    const TIER_OPTIONS: number[] = [1, 2, 3];

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const router = useRouter();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [tier, setTier] = useState<number>(1);
    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string>('Life');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('/api/achievements', {
                tier,
                name,
                category,
                description,
                date,
            });
            router.refresh();
            onClose();
        } catch {
            setErrors({
                form: 'Failed to save achievement. Please try again.',
            });
            setIsSubmitting(false);
        }
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const validate = (): Record<string, string> => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required.';
        } else if (!/^[A-Z]/.test(name.trim())) {
            newErrors.name = 'Name must start with a capital letter.';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required.';
        } else if (!/^[A-Z]/.test(description.trim())) {
            newErrors.description =
                'Description must start with a capital letter.';
        } else if (!/[.!?]$/.test(description.trim())) {
            newErrors.description =
                'Description must end with punctuation (., !, or ?).';
        }

        if (!date.trim()) {
            newErrors.date = 'Date is required.';
        } else if (
            !/^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(date.trim())
        ) {
            newErrors.date = 'Date must be in MM/DD/YYYY format.';
        }

        return newErrors;
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD ACHIEVEMENT" onClose={onClose}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <span className={styles.label}>Tier</span>
                        <select
                            className={styles.select}
                            value={tier}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => setTier(Number(e.target.value))}
                        >
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
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => setCategory(e.target.value)}
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={`${styles.row} ${styles['row--wide-first']}`}>
                    <div className={styles.field}>
                        <span className={styles.label}>Name</span>
                        <input
                            className={styles.input}
                            value={name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setName(e.target.value)}
                        />
                        {errors.name ? (
                            <span className={styles.error}>{errors.name}</span>
                        ) : null}
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>Date</span>
                        <input
                            className={styles.input}
                            placeholder="MM/DD/YYYY"
                            value={date}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setDate(e.target.value)}
                        />
                        {errors.date ? (
                            <span className={styles.error}>{errors.date}</span>
                        ) : null}
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
                    {errors.description ? (
                        <span className={styles.error}>
                            {errors.description}
                        </span>
                    ) : null}
                </div>
                {errors.form ? (
                    <span className={styles.error}>{errors.form}</span>
                ) : null}
                <div className={styles.actions}>
                    <button
                        className={styles['cancel-button']}
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles['submit-button']}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddAchievementModal;
