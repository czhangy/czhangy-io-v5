'use client';

import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown/Dropdown';
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
        const res = await fetch('/api/cardistry', {
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

    const handleTypeChange = (value: string): void => {
        setType(value);
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD MOVE" onClose={onClose}>
            <div className={styles['add-move-modal']}>
                <div className={styles.row}>
                    <div className={styles.field}>
                        <span className={styles.label}>Name</span>
                        <input
                            className={styles.input}
                            value={name}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                            ) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    </div>
                    <div className={styles.field}>
                        <span className={styles.label}>Type</span>
                        <Dropdown
                            value={type}
                            onChange={handleTypeChange}
                            options={CARDISTRY_MOVE_TYPES}
                        />
                    </div>
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submit}
                        onClick={handleSubmit}
                        disabled={!name.trim() || !type}
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddMoveModal;
