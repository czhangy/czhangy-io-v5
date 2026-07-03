'use client';

import { useEffect, useRef, useState } from 'react';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import CardsIcon from '@/lib/icons/CardsIcon';
import { Key } from '@/lib/static/enums';
import { SkillEntry } from '@/lib/static/types';
import styles from './CardistryPanel.module.scss';

type CardistryPanelProps = {
    initialEntry: SkillEntry;
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const CardistryPanel: React.FC<CardistryPanelProps> = ({
    initialEntry,
    label,
    icon,
    cols,
    rows,
}) => {
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

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = (): void => {
        setDraft(entry.name);
        setIsEditing(true);
    };

    const handleCancel = (): void => {
        setIsEditing(false);
        setDraft('');
    };

    const handleSave = async (): Promise<void> => {
        const trimmed = draft.trim();
        if (!trimmed) return;
        const newEntry: SkillEntry = { name: trimmed };
        await fetch('/api/status/skill', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: JSON.stringify(newEntry) }),
        });
        setEntry(newEntry);
        setIsEditing(false);
        setDraft('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSave();
        if (e.key === Key.Escape) handleCancel();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const editButton: React.ReactNode =
        isAdmin && !isEditing ? <PanelButton onClick={handleEdit} /> : null;

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
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={editButton}
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
                            placeholder="What are you practicing?"
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
                </div>
            ) : (
                <div className={styles.content}>
                    <span className={styles.icon}>
                        <CardsIcon />
                    </span>
                    <span className={styles.name}>{entry.name}</span>
                </div>
            )}
        </StatusPanel>
    );
};

export default CardistryPanel;
