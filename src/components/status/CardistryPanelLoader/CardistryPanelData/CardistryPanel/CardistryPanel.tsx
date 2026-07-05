'use client';

import { useEffect, useRef, useState } from 'react';
import EditButton from '@/components/status/EditButton/EditButton';
import LinkButton from '@/components/status/LinkButton/LinkButton';
import PanelDropdown from '@/components/status/PanelDropdown/PanelDropdown';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { Move } from '@/lib/static/types';
import CardistryHelpers from '@/lib/utils/CardistryHelpers';
import styles from './CardistryPanel.module.scss';

type CardistryPanelProps = {
    initialMove: Move | null;
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

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [activeMove, setActiveMove] = useState<Move | null>(initialMove);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [moves, setMoves] = useState<Move[]>([]);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleEdit = async (): Promise<void> => {
        setIsEditing(true);
        const res = await fetch('/api/moves');
        if (res.ok) setMoves((await res.json()) as Move[]);
    };

    const handleCancel = (): void => {
        setIsEditing(false);
        setMoves([]);
    };

    const handleSelect = async (move: Move): Promise<void> => {
        const res = await fetch(`/api/moves/${encodeURIComponent(move.name)}`, {
            method: 'PATCH',
        });
        if (!res.ok) return;
        setActiveMove((await res.json()) as Move);
        handleCancel();
    };

    const handleDropdownChange = async (value: string): Promise<void> => {
        const move = moves.find((m) => m.name === value);
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

    const proficiency = activeMove
        ? CardistryHelpers.getProficiency(activeMove.count)
        : null;

    const headerActions: React.ReactNode = (
        <>
            <EditButton onClick={handleEdit} disabled={isEditing} />
            <LinkButton href="/status/cardistry" />
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
                    <PanelDropdown
                        value={activeMove?.name ?? ''}
                        onChange={handleDropdownChange}
                        options={moves.map((m) => m.name)}
                        placeholder="— Select a move —"
                    />
                </div>
            ) : (
                <div className={styles.content}>
                    <div className={styles.left}>
                        <span className={styles.name}>
                            {activeMove?.name ?? '—'}
                        </span>
                        {activeMove?.type ? (
                            <div className={styles.metadata}>
                                <span className={styles['type-tag']}>
                                    {activeMove.type}
                                </span>
                            </div>
                        ) : null}
                    </div>
                    {proficiency ? (
                        <div className={styles.proficiency}>
                            <div className={styles.pips}>
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className={`${styles.pip}${i < proficiency.tier ? ` ${styles['pip--filled']}` : ''}`}
                                    />
                                ))}
                            </div>
                            <span className={styles.count}>
                                {proficiency.display}
                            </span>
                        </div>
                    ) : null}
                </div>
            )}
        </StatusPanel>
    );
};

export default CardistryPanel;
