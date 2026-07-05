'use client';

import { useState } from 'react';
import AddButton from '@/components/common/AddButton/AddButton';
import FormField from '@/components/common/FormField/FormField';
import Modal from '@/components/common/Modal/Modal';
import { CARDISTRY_MOVE_TYPES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { Move } from '@/lib/static/types';
import styles from './AddMoveModal.module.scss';

type AddMoveModalProps = {
    onClose: () => void;
    onAdd: (move: Move) => void;
};

const AddMoveModal: React.FC<AddMoveModalProps> = ({ onClose, onAdd }) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [name, setName] = useState<string>('');
    const [type, setType] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const res = await fetch('/api/moves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed, type }),
        });
        if (!res.ok) return;
        onAdd((await res.json()) as Move);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD MOVE" onClose={onClose}>
            <div className={styles['add-move-modal']}>
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
                <AddButton
                    label="Add"
                    disabled={!name.trim() || !type}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );
};

export default AddMoveModal;
