'use client';

import Modal from '@/components/common/Modal/Modal';
import styles from './RoutineNotesModal.module.scss';

type RoutineNotesModalProps = {
    name: string;
    notes: string;
    onClose: () => void;
};

const RoutineNotesModal: React.FC<RoutineNotesModalProps> = ({
    name,
    notes,
    onClose,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const EMPTY_LABEL: string = 'No notes yet.';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title={name.toUpperCase()} onClose={onClose}>
            <p
                className={`${styles.notes}${notes ? '' : ` ${styles['notes--empty']}`}`}
            >
                {notes || EMPTY_LABEL}
            </p>
        </Modal>
    );
};

export default RoutineNotesModal;
