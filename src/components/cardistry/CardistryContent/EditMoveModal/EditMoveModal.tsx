'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import Modal from '@/components/common/Modal/Modal';
import { CARDISTRY_MOVE_TYPES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { Move } from '@/lib/static/types';
import styles from './EditMoveModal.module.scss';

type EditMoveModalProps = {
    move: Move;
    onClose: () => void;
    onEdit: (move: Move) => void;
};

const EditMoveModal: React.FC<EditMoveModalProps> = ({
    move,
    onClose,
    onEdit,
}) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>(move.name);
    const [type, setType] = useState<string>(move.type);
    const [count, setCount] = useState<string>(String(move.count));

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const trimmed = name.trim();
        const parsedCount = parseInt(count, 10);
        if (!trimmed || !type || isNaN(parsedCount) || parsedCount < 0) return;
        const res = await fetch(`/api/moves/${encodeURIComponent(move.name)}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: trimmed,
                type,
                count: parsedCount,
            }),
        });
        if (!res.ok) return;
        onEdit((await res.json()) as Move);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isValid: boolean =
        name.trim().length > 0 && type.length > 0 && /^\d+$/.test(count.trim());

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT MOVE" onClose={onClose}>
            <div className={styles['edit-move-modal']}>
                <div className={styles.row}>
                    <FormField
                        label="Name"
                        value={name}
                        onChange={setName}
                        onKeyDown={handleKeyDown}
                        autoFocus
                    />
                    <FormField
                        label="Type"
                        value={type}
                        onChange={setType}
                        options={CARDISTRY_MOVE_TYPES}
                    />
                </div>
                <FormField
                    label="Count"
                    value={count}
                    onChange={setCount}
                    onKeyDown={handleKeyDown}
                />
                <AddButton
                    label="Save"
                    disabled={!isValid}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );
};

export default EditMoveModal;
