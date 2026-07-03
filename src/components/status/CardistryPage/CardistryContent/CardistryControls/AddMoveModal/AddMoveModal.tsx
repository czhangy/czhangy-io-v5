'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
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

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const res = await fetch('/api/cardistry', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed }),
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
                <input
                    className={styles.input}
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Move name..."
                    autoFocus
                />
                <button
                    type="button"
                    className={styles.submit}
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                >
                    Add
                </button>
            </div>
        </Modal>
    );
};

export default AddMoveModal;
