'use client';

import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown/Dropdown';
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
        const res = await fetch(`/api/cardistry/${move.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: trimmed, type, count: parsedCount }),
        });
        if (!res.ok) return;
        onEdit((await res.json()) as Move);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter) handleSubmit();
        if (e.key === Key.Escape) onClose();
    };

    const handleCountChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setCount(e.target.value);
    };

    const handleTypeChange = (value: string): void => {
        setType(value);
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
                <div className={styles.field}>
                    <span className={styles.label}>Count</span>
                    <input
                        className={styles.input}
                        value={count}
                        onChange={handleCountChange}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.submit}
                        onClick={handleSubmit}
                        disabled={!isValid}
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditMoveModal;
