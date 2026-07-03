'use client';

import { useEffect, useRef, useState } from 'react';
import PanelButton from '@/components/status/PanelButton/PanelButton';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { useSession } from '@/lib/context/SessionContext';
import LinkIcon from '@/lib/icons/LinkIcon';
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
    const [moves, setMoves] = useState<CardistryMoveEntry[]>([]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = async (): Promise<void> => {
        setIsEditing(true);
        const res = await fetch('/api/cardistry');
        if (res.ok) setMoves((await res.json()) as CardistryMoveEntry[]);
    };

    const handleCancel = (): void => {
        setIsEditing(false);
        setMoves([]);
    };

    const handleSelect = async (move: CardistryMoveEntry): Promise<void> => {
        const res = await fetch(`/api/cardistry/${move.id}`, {
            method: 'PATCH',
        });
        if (!res.ok) return;
        setActiveMove((await res.json()) as CardistryMoveEntry);
        handleCancel();
    };

    const handleDropdownChange = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ): Promise<void> => {
        const id = parseInt(e.target.value, 10);
        const move = moves.find((m) => m.id === id);
        if (move) await handleSelect(move);
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
                    <select
                        className={styles.select}
                        value={activeMove?.id ?? ''}
                        onChange={handleDropdownChange}
                    >
                        {!activeMove && (
                            <option value="" disabled>
                                — Select a move —
                            </option>
                        )}
                        {moves.map((move) => (
                            <option key={move.id} value={move.id}>
                                {move.name}
                            </option>
                        ))}
                    </select>
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
