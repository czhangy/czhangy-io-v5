import styles from './StatusPanel.module.scss';

type StatusPanelProps = {
    label: string;
    cols: number;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    headerAction?: React.ReactNode;
    rows?: number;
    isLoading?: boolean;
    noPadding?: boolean;
    mobileOrder?: number;
};

const StatusPanel: React.FC<StatusPanelProps> = ({
    label,
    cols,
    icon,
    children,
    headerAction,
    rows = 1,
    isLoading = false,
    noPadding = false,
    mobileOrder,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div
            className={`${styles.panel}${isLoading ? ` ${styles['panel--loading']}` : ''}`}
            style={
                {
                    '--cols': cols,
                    '--cols-tablet': Math.min(cols, 4),
                    '--rows': rows,
                    ...(mobileOrder !== undefined
                        ? { '--mobile-order': mobileOrder }
                        : {}),
                } as React.CSSProperties
            }
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
            <div
                className={`${styles.body}${noPadding ? ` ${styles['body--no-padding']}` : ''}`}
            >
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
