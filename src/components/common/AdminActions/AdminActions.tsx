'use client';

import { useState } from 'react';
import ConfirmationModal from '@/components/common/AdminActions/ConfirmationModal/ConfirmationModal';
import DeleteIcon from '@/lib/icons/DeleteIcon';
import EditIcon from '@/lib/icons/EditIcon';
import StarIcon from '@/lib/icons/StarIcon';
import styles from './AdminActions.module.scss';

type AdminActionsProps = {
    entryName: string;
    onHighlight?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
};

const AdminActions: React.FC<AdminActionsProps> = ({
    entryName,
    onHighlight,
    onEdit,
    onDelete,
    className,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    type PendingAction = 'highlight' | 'delete' | null;

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [pendingAction, setPendingAction] = useState<PendingAction>(null);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleHighlightClick = (): void => {
        setPendingAction('highlight');
    };

    const handleDeleteClick = (): void => {
        setPendingAction('delete');
    };

    const handleCancel = (): void => {
        setPendingAction(null);
    };

    const handleConfirm = (): void => {
        if (pendingAction === 'highlight') onHighlight?.();
        if (pendingAction === 'delete') onDelete?.();
        setPendingAction(null);
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={`${styles['admin-actions']} ${className ?? ''}`}>
            {onHighlight ? (
                <button
                    type="button"
                    className={styles['action-button']}
                    onClick={handleHighlightClick}
                >
                    <StarIcon />
                </button>
            ) : null}
            {onEdit ? (
                <button
                    type="button"
                    className={styles['action-button']}
                    onClick={onEdit}
                >
                    <EditIcon />
                </button>
            ) : null}
            {onDelete ? (
                <button
                    type="button"
                    className={styles['action-button']}
                    onClick={handleDeleteClick}
                >
                    <DeleteIcon />
                </button>
            ) : null}
            {pendingAction === 'highlight' ? (
                <ConfirmationModal
                    title="CONFIRM HIGHLIGHT"
                    action="highlight"
                    entryName={entryName}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            ) : null}
            {pendingAction === 'delete' ? (
                <ConfirmationModal
                    title="CONFIRM DELETE"
                    action="delete"
                    entryName={entryName}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            ) : null}
        </div>
    );
};

export default AdminActions;
