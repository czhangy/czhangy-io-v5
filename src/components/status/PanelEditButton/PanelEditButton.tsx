import EditIcon from '@/lib/icons/EditIcon';
import styles from './PanelEditButton.module.scss';

type PanelEditButtonProps = {
    onClick: () => void;
};

const PanelEditButton: React.FC<PanelEditButtonProps> = ({ onClick }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <button type="button" className={styles.button} onClick={onClick}>
            <EditIcon />
        </button>
    );
};

export default PanelEditButton;
