import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import styles from './ReadingPanel.module.scss';

type ReadingPanelProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const ReadingPanel: React.FC<ReadingPanelProps> = ({
    label,
    icon,
    cols,
    rows,
}) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const PLACEHOLDER_COUNT: number = 3;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel label={label} icon={icon} cols={cols} rows={rows}>
            <ul className={styles.list}>
                {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
                    <li key={i} className={styles.item}>
                        <div className={styles['cover-placeholder']} />
                        <div className={styles.info}>
                            <div className={styles['name-placeholder']} />
                            <div className={styles['genre-placeholder']} />
                        </div>
                    </li>
                ))}
            </ul>
        </StatusPanel>
    );
};

export default ReadingPanel;
