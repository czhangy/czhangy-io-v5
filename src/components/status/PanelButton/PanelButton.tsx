import EditIcon from '@/lib/icons/EditIcon';
import styles from './PanelButton.module.scss';

type PanelButtonProps = {
    onClick: () => void;
    icon?: React.ReactNode;
};

const PanelButton: React.FC<PanelButtonProps> = ({ onClick, icon }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <button type="button" className={styles.button} onClick={onClick}>
            {icon ?? <EditIcon />}
        </button>
    );
};

export default PanelButton;
