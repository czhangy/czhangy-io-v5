import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import LearnIcon from '@/lib/icons/LearnIcon';
import SkillPanelData from './SkillPanelData/SkillPanelData';

type SkillPanelLoaderProps = {
    cols: number;
    rows?: number;
};

const SkillPanelLoader: React.FC<SkillPanelLoaderProps> = ({ cols, rows }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'LEARNING';
    const ICON: React.ReactNode = <LearnIcon />;

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Suspense
            fallback={
                <StatusPanel
                    label={LABEL}
                    icon={ICON}
                    cols={cols}
                    rows={rows}
                    isLoading
                />
            }
        >
            <SkillPanelData label={LABEL} icon={ICON} cols={cols} rows={rows} />
        </Suspense>
    );
};

export default SkillPanelLoader;
