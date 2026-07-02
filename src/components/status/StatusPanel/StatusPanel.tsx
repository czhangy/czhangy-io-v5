import styles from './StatusPanel.module.scss';

type StatusPanelProps = {
    label: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    headerAction?: React.ReactNode;
    className?: string;
    isLoading?: boolean;
};

const StatusPanel: React.FC<StatusPanelProps> = ({
    label,
    icon,
    children,
    headerAction,
    className,
    isLoading = false,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            className={`${styles.panel}${isLoading ? ` ${styles['panel--loading']}` : ''} ${className ?? ''}`}
        >
            <div className={styles.header}>
                <div className={styles['header-left']}>
                    {icon ? <span className={styles.icon}>{icon}</span> : null}
                    <span className={styles.label}>{label}</span>
                </div>
                {headerAction ? (
                    <div className={styles['header-action']}>
                        {headerAction}
                    </div>
                ) : null}
            </div>
            <div className={styles.body}>
                {isLoading ? (
                    <div className={styles['loading-rule']} />
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default StatusPanel;
