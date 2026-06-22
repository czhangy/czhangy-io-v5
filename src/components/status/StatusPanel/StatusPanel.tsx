import styles from './StatusPanel.module.scss';

type StatusPanelProps = {
    label: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
    className?: string;
};

const StatusPanel: React.FC<StatusPanelProps> = ({
    label,
    children,
    headerAction,
    className,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={`${styles.panel} ${className ?? ''}`}>
            <div className={styles.header}>
                <span className={styles.label}>{label}</span>
                {headerAction ? (
                    <div className={styles['header-action']}>
                        {headerAction}
                    </div>
                ) : null}
            </div>
            <div className={styles.body}>{children}</div>
        </div>
    );
};

export default StatusPanel;
