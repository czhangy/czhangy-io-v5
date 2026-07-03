'use client';

import { useEffect, useRef, useState } from 'react';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import LinkIcon from '@/lib/icons/LinkIcon';
import { Key } from '@/lib/static/enums';
import { CardistryMoveEntry } from '@/lib/static/types';
import styles from './CardistryPanel.module.scss';

type CardistryPanelProps = {
    initialMove: CardistryMoveEntry | null;
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const CardistryPanel: React.FC<CardistryPanelProps> = ({
    initialMove,
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

    const [activeMove, setActiveMove] = useState<CardistryMoveEntry | null>(
        initialMove
    );
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [draft, setDraft] = useState<string>('');
    const [moves, setMoves] = useState<CardistryMoveEntry[]>([]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = async (): Promise<void> => {
        setDraft('');
        setIsEditing(true);
        const res = await fetch('/api/cardistry');
        if (res.ok) setMoves((await res.json()) as CardistryMoveEntry[]);
    };

    const handleCancel = (): void => {
        setIsEditing(false);
        setDraft('');
        setMoves([]);
    };

    const handleAdd = async (): Promise<void> => {
        const trimmed = draft.trim();
        if (!trimmed) return;
        const res = await fetch('/api/cardistry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed }),
        });
        if (!res.ok) return;
        setActiveMove((await res.json()) as CardistryMoveEntry);
        handleCancel();
    };

    const handleSelect = async (move: CardistryMoveEntry): Promise<void> => {
        const res = await fetch(`/api/cardistry/${move.id}`, {
            method: 'PATCH',
        });
        if (!res.ok) return;
        setActiveMove((await res.json()) as CardistryMoveEntry);
        handleCancel();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleAdd();
        if (e.key === Key.Escape) handleCancel();
    };

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
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    const headerActions: React.ReactNode = (
        <>
            <PanelButton href="/status/cardistry" icon={<LinkIcon />} />
            {isAdmin && !isEditing ? (
                <PanelButton onClick={handleEdit} />
            ) : null}
        </>
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            headerAction={headerActions}
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
                            placeholder="New move..."
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
                    {moves.length > 0 ? (
                        <ul className={styles['moves-list']}>
                            {moves.map((move) => (
                                <li key={move.id}>
                                    <button
                                        type="button"
                                        className={`${styles.move}${move.id === activeMove?.id ? ` ${styles['move--active']}` : ''}`}
                                        onClick={() => handleSelect(move)}
                                    >
                                        {move.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            ) : (
                <div className={styles.content}>
                    <span className={styles.name}>
                        {activeMove?.name ?? '—'}
                    </span>
                </div>
            )}
        </StatusPanel>
    );
};

export default CardistryPanel;
