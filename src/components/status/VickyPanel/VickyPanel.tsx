import Image from 'next/image';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import HeartIcon from '@/lib/icons/HeartIcon';
import styles from './VickyPanel.module.scss';

type VickyPanelProps = {
    cols: number;
    rows?: number;
};

const VickyPanel: React.FC<VickyPanelProps> = ({ cols, rows }) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label="VICKO"
            icon={<HeartIcon />}
            cols={cols}
            rows={rows}
            noPadding
        >
            <div className={styles['image-wrapper']}>
                <Image
                    src="/vicky.jpg"
                    alt="Vicky"
                    fill
                    sizes="(max-width: 1024px) 50vw, 18rem"
                    className={styles.image}
                />
            </div>
        </StatusPanel>
    );
};

export default VickyPanel;
