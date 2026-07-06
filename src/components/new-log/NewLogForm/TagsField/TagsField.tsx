'use client';

import { useState } from 'react';
import { Key } from '@/lib/static/enums';
import styles from './TagsField.module.scss';

type TagsFieldProps = {
    label: string;
    tags: string[];
    onChange: (tags: string[]) => void;
};

const TagsField: React.FC<TagsFieldProps> = ({ label, tags, onChange }) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [draft, setDraft] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleCommitDraft = (): void => {
        const trimmed = draft.trim();
        if (!trimmed || tags.includes(trimmed)) {
            setDraft('');
            return;
        }
        onChange([...tags, trimmed]);
        setDraft('');
    };

    const handleRemoveTag = (tag: string): void => {
        onChange(tags.filter((t) => t !== tag));
    };

    const handleDraftChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setDraft(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter || e.key === ',') {
            e.preventDefault();
            handleCommitDraft();
            return;
        }
        if (e.key === Key.Backspace && !draft && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['tags-field']}>
            <span className={styles.label}>{label}</span>
            <div className={styles.chips}>
                {tags.map((tag) => (
                    <span key={tag} className={styles.chip}>
                        {tag}
                        <button
                            type="button"
                            className={styles['remove-button']}
                            onClick={() => handleRemoveTag(tag)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    className={styles.input}
                    value={draft}
                    onChange={handleDraftChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleCommitDraft}
                    placeholder={tags.length === 0 ? 'Add a tag...' : ''}
                />
            </div>
        </div>
    );
};

export default TagsField;
