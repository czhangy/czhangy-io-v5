import EditIcon from '@/lib/icons/EditIcon';
import styles from './EditButton.module.scss';

type EditButtonProps = {
    className?: string;
    onClick: () => void;
};

const EditButton: React.FC<EditButtonProps> = ({ className, onClick }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <button
            type="button"
            className={`${styles.button} ${className ?? ''}`}
            onClick={onClick}
        >
            <EditIcon />
        </button>
    );
};

export default EditButton;
