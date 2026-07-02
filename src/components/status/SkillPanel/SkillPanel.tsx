'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from '@/lib/context/SessionContext';
import CardistryIcon from '@/lib/icons/CardistryIcon';
import CodingIcon from '@/lib/icons/CodingIcon';
import MagicIcon from '@/lib/icons/MagicIcon';
import { SkillCategory, SkillEntry } from '@/lib/utils/shared/types';
import PanelEditButton from '../PanelEditButton/PanelEditButton';
import StatusPanel from '../StatusPanel/StatusPanel';
import styles from './SkillPanel.module.scss';

type SkillPanelProps = {
    initialEntry: SkillEntry;
    icon?: React.ReactNode;
    className?: string;
};

const SkillPanel: React.FC<SkillPanelProps> = ({
    initialEntry,
    icon,
    className,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const CATEGORIES: SkillCategory[] = ['Coding', 'Cardistry', 'Magic'];

    const CATEGORY_ICONS: Record<SkillCategory, React.ReactNode> = {
        Coding: <CodingIcon />,
        Cardistry: <CardistryIcon />,
        Magic: <MagicIcon />,
    };

    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const editFormRef = useRef<HTMLDivElement>(null);
    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [entry, setEntry] = useState<SkillEntry>(initialEntry);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [draft, setDraft] = useState<string>('');
    const [draftCategory, setDraftCategory] = useState<SkillCategory>(
        initialEntry.category
    );

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = () => {
        setDraft(entry.name);
        setDraftCategory(entry.category);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setDraft('');
    };

    const handleSave = async () => {
        const trimmed = draft.trim();
        if (!trimmed) return;
        const newEntry: SkillEntry = { name: trimmed, category: draftCategory };
        await fetch('/api/status/skill', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntry) }),
        });
        setEntry(newEntry);
        setIsEditing(false);
        setDraft('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') handleCancel();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const editButton: React.ReactNode =
        isAdmin && !isEditing ? <PanelEditButton onClick={handleEdit} /> : null;

    // -------------------------------------------------------------------------
    // EFFECTS
    // -------------------------------------------------------------------------

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                editFormRef.current &&
                !editFormRef.current.contains(e.target as Node)
            ) {
                handleCancel();
            }
        };
        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isEditing]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label="LEARNING"
            icon={icon}
            headerAction={editButton}
            className={className}
        >
            {isEditing ? (
                <div ref={editFormRef} className={styles['edit-form']}>
                    <div className={styles['input-row']}>
                        <input
                            className={styles.input}
                            value={draft}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What are you learning?"
                            autoFocus
                        />
                        <button
                            type="button"
                            className={styles.clear}
                            onClick={handleCancel}
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.categories}>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`${styles.category}${draftCategory === cat ? ` ${styles['category--active']}` : ''}`}
                                onClick={() => setDraftCategory(cat)}
                            >
                                <span className={styles['category-icon']}>
                                    {CATEGORY_ICONS[cat]}
                                </span>
                                <span className={styles['category-name']}>
                                    {cat}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.content}>
                    <span className={styles.icon}>
                        {CATEGORY_ICONS[entry.category]}
                    </span>
                    <span className={styles.name}>{entry.name}</span>
                </div>
            )}
        </StatusPanel>
    );
};

export default SkillPanel;
