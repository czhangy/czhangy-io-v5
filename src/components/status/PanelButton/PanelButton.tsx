import Link from 'next/link';
import EditIcon from '@/lib/icons/EditIcon';
import styles from './PanelButton.module.scss';

type PanelButtonProps = {
    icon?: React.ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
};

const PanelButton: React.FC<PanelButtonProps> = ({
    icon,
    href,
    onClick,
    disabled,
}) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const content = icon ?? <EditIcon />;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    if (href) {
        return (
            <Link href={href} className={styles.button}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
};

export default PanelButton;
