'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import { PROJECT_STATUSES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { CreateProjectParams } from '@/lib/static/types';
import UrlHelpers from '@/lib/utils/UrlHelpers';
import styles from './ProjectForm.module.scss';

type ProjectFormProps = {
    submitLabel: string;
    initialValues?: Partial<CreateProjectParams>;
    onSubmit: (values: CreateProjectParams) => Promise<void>;
    onClose: () => void;
};

const ProjectForm: React.FC<ProjectFormProps> = ({
    submitLabel,
    initialValues,
    onSubmit,
    onClose,
}) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>(initialValues?.name ?? '');
    const [description, setDescription] = useState<string>(
        initialValues?.description ?? ''
    );
    const [icon, setIcon] = useState<string>(initialValues?.icon ?? '');
    const [status, setStatus] = useState<string>(
        initialValues?.status ?? PROJECT_STATUSES[0]
    );
    const [url, setUrl] = useState<string>(initialValues?.url ?? '');
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
                description: description.trim(),
                icon: icon.trim(),
                status,
                url: url.trim(),
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
        if (!description.trim()) return 'Description is required.';
        if (!icon.trim()) return 'Icon is required.';
        if (!UrlHelpers.isImageUrl(icon.trim()))
            return 'Icon must be a valid image URL.';
        if (!url.trim()) return 'Link is required.';
        if (!UrlHelpers.isValidUrl(url.trim()))
            return 'Link must be a valid URL.';
        return '';
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['project-form']}>
            <FormField
                label="Name"
                value={name}
                onChange={setName}
                onKeyDown={handleKeyDown}
                autoFocus
            />
            <FormField
                label="Description"
                value={description}
                onChange={setDescription}
                onKeyDown={handleKeyDown}
            />
            <FormField
                label="Icon"
                value={icon}
                onChange={setIcon}
                onKeyDown={handleKeyDown}
            />
            <FormField
                label="Link"
                value={url}
                onChange={setUrl}
                onKeyDown={handleKeyDown}
            />
            <FormField
                label="Status"
                value={status}
                onChange={setStatus}
                options={PROJECT_STATUSES}
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

export default ProjectForm;
