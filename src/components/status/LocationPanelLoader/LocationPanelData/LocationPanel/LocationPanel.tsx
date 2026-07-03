'use client';

import { useState } from 'react';
import PanelEditButton from '@/components/status/PanelEditButton/PanelEditButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import { Key } from '@/lib/static/enums';
import styles from './LocationPanel.module.scss';

type LocationPanelProps = {
    initialLocation: string;
    label: string;
    icon: React.ReactNode;
    className?: string;
};

const LocationPanel: React.FC<LocationPanelProps> = ({
    initialLocation,
    label,
    icon,
    className,
}) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [location, setLocation] = useState<string>(initialLocation);
    const [draft, setDraft] = useState<string>(initialLocation);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = () => {
        setDraft(location);
        setIsEditing(true);
    };

    const handleSave = async () => {
        const trimmed = draft.trim();
        if (!trimmed) return;

        await fetch('/api/status/location', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: trimmed }),
        });

        setLocation(trimmed);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === Key.Enter) handleSave();
        if (e.key === Key.Escape) setIsEditing(false);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const editButton: React.ReactNode =
        isAdmin && !isEditing ? <PanelEditButton onClick={handleEdit} /> : null;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            headerAction={editButton}
            className={className}
        >
            {isEditing ? (
                <div className={styles['edit-form']}>
                    <input
                        className={styles.input}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles['action-button']}
                            onClick={() => setIsEditing(false)}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            className={`${styles['action-button']} ${styles['action-button--save']}`}
                            onClick={handleSave}
                        >
                            SAVE
                        </button>
                    </div>
                </div>
            ) : (
                <p className={styles.location}>{location}</p>
            )}
        </StatusPanel>
    );
};

export default LocationPanel;
