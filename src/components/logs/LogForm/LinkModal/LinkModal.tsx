'use client';

import { useState } from 'react';
import FormField from '@/components/common/FormField/FormField';
import Modal from '@/components/common/Modal/Modal';
import { Key } from '@/lib/static/enums';
import styles from './LinkModal.module.scss';

type LinkModalProps = {
    onConfirm: (url: string) => void;
    onCancel: () => void;
};

const LinkModal: React.FC<LinkModalProps> = ({ onConfirm, onCancel }) => {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [url, setUrl] = useState<string>('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === Key.Enter && url.trim()) onConfirm(url.trim());
        if (e.key === Key.Escape) onCancel();
    };

    const handleConfirmClick = (): void => {
        onConfirm(url.trim());
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isValid: boolean = url.trim().length > 0;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD LINK" onClose={onCancel}>
            <div className={styles['link-modal']}>
                <FormField
                    label="URL"
                    value={url}
                    onChange={setUrl}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles['confirm-button']}
                        disabled={!isValid}
                        onClick={handleConfirmClick}
                    >
                        Add
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LinkModal;
