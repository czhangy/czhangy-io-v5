import Modal from '@/components/common/Modal/Modal';
import styles from './ConfirmationModal.module.scss';

type ConfirmationModalProps = {
    title: string;
    action: string;
    entryName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    action,
    entryName,
    onConfirm,
    onCancel,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title={title} onClose={onCancel}>
            <div className={styles['confirmation-modal']}>
                <p className={styles.message}>
                    Are you sure you want to {action}{' '}
                    <span className={styles['entry-name']}>{entryName}</span>?
                </p>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles['cancel-button']}
                        onClick={onCancel}
                    >
                        No
                    </button>
                    <button
                        type="button"
                        className={styles['confirm-button']}
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
