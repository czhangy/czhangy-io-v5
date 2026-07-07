import Modal from '@/components/common/Modal/Modal';
import styles from './AlertModal.module.scss';

type AlertModalProps = {
    title: string;
    message: string;
    onClose: () => void;
};

const AlertModal: React.FC<AlertModalProps> = ({ title, message, onClose }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title={title} onClose={onClose}>
            <div className={styles['alert-modal']}>
                <p className={styles.message}>{message}</p>
                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles['ok-button']}
                        onClick={onClose}
                    >
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AlertModal;
