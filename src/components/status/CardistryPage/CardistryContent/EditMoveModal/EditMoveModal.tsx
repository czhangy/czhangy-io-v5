'use client';

import { useState } from 'react';
import Modal from '@/components/common/Modal/Modal';
import { CARDISTRY_MOVE_TYPES } from '@/lib/static/constants';
import { Key } from '@/lib/static/enums';
import { CardistryMoveEntry } from '@/lib/static/types';
import styles from './EditMoveModal.module.scss';

type EditMoveModalProps = {
    move: CardistryMoveEntry;
    onClose: () => void;
    onEdit: (move: CardistryMoveEntry) => void;
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
    const [count, setCount] = useState<number>(move.count);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (): Promise<void> => {
        const trimmed = name.trim();
        if (!trimmed || !type) return;
        const res = await fetch(`/api/cardistry/${move.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed, type, count }),
        });
        if (!res.ok) return;
        onEdit((await res.json()) as CardistryMoveEntry);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    const handleCountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = parseInt(e.target.value, 10);
        setCount(isNaN(value) || value < 0 ? 0 : value);
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isValid: boolean = name.trim().length > 0 && type.length > 0;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="EDIT MOVE" onClose={onClose}>
            <div className={styles['edit-move-modal']}>
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
                <select
                    className={styles.select}
                    value={type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setType(e.target.value)
                    }
                >
                    <option value="">Select type...</option>
                    {CARDISTRY_MOVE_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
                <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={count}
                    onChange={handleCountChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Count..."
                />
                <button
                    type="button"
                    className={styles.submit}
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    Save
                </button>
            </div>
        </Modal>
    );
};

export default EditMoveModal;
