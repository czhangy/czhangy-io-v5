import EditButton from '@/components/common/EditButton/EditButton';
import styles from './PanelEditButton.module.scss';

type PanelEditButtonProps = {
    onClick: () => void;
};

const PanelEditButton: React.FC<PanelEditButtonProps> = ({ onClick }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return <EditButton onClick={onClick} className={styles.button} />;
};

export default PanelEditButton;
