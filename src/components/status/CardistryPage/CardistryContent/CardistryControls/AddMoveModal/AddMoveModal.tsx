'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import { CARDISTRY_MOVE_TYPES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { CardistryMoveEntry } from '@/lib/static/types';
import styles from './AddMoveModal.module.scss';

type AddMoveModalProps = {
    onClose: () => void;
    onAdd: (move: CardistryMoveEntry) => void;
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
        onAdd((await res.json()) as CardistryMoveEntry);
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
                        <select
                            className={styles.select}
                            value={type}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => setType(e.target.value)}
                        >
                            <option value="" disabled>
                                —
                            </option>
                            {CARDISTRY_MOVE_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
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
