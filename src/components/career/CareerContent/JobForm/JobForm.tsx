'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import { Key } from '@/lib/static/enums';
import { CreateJobParams } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import styles from './JobForm.module.scss';

type JobFormProps = {
    submitLabel: string;
    initialValues?: Partial<CreateJobParams>;
    onSubmit: (values: CreateJobParams) => Promise<void>;
    onClose: () => void;
};

const JobForm: React.FC<JobFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
    onClose,
}) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [company, setCompany] = useState<string>(
        initialValues?.company ?? ''
    );
    const [title, setTitle] = useState<string>(initialValues?.title ?? '');
    const [logo, setLogo] = useState<string>(initialValues?.logo ?? '');
    const [startDate, setStartDate] = useState<string>(
        initialValues?.startDate ?? ''
    );
    const [endDate, setEndDate] = useState<string>(
        initialValues?.endDate ?? ''
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
                company: company.trim(),
                title: title.trim(),
                logo: logo.trim(),
                startDate: DateHelpers.getMMDDYYYY(startDate.trim()),
                endDate: endDate.trim()
                    ? DateHelpers.getMMDDYYYY(endDate.trim())
                    : null,
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
        if (!company.trim()) return 'Company is required.';
        if (!title.trim()) return 'Title is required.';
        if (!logo.trim()) return 'Logo is required.';
        if (!DateHelpers.getDateObject(startDate.trim()))
            return 'Start date has incorrect format.';
        if (endDate.trim() && !DateHelpers.getDateObject(endDate.trim()))
            return 'End date has incorrect format.';
        return '';
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['job-form']}>
            <FormField
                label="Company"
                value={company}
                onChange={setCompany}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <FormField
                label="Title"
                value={title}
                onChange={setTitle}
                onKeyDown={handleKeyDown}
            />
            <FormField
                label="Logo"
                value={logo}
                onChange={setLogo}
                onKeyDown={handleKeyDown}
            />
            <div className={styles.row}>
                <FormField
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    onKeyDown={handleKeyDown}
                />
                <FormField
                    label="End Date (blank = Present)"
                    value={endDate}
                    onChange={setEndDate}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {error ? <span className={styles.error}>{error}</span> : null}
            <AddButton
                label={isSubmitting ? 'Saving...' : submitLabel}
                disabled={isSubmitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default JobForm;
