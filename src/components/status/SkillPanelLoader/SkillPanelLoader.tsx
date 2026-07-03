import { Suspense } from 'react';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import LearnIcon from '@/lib/icons/LearnIcon';
import SkillPanelData from './SkillPanelData/SkillPanelData';

type SkillPanelLoaderProps = {
    className?: string;
};

const SkillPanelLoader: React.FC<SkillPanelLoaderProps> = ({ className }) => {
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
                    isLoading
                    className={className}
                />
            }
        >
            <SkillPanelData label={LABEL} icon={ICON} className={className} />
        </Suspense>
    );
};

export default SkillPanelLoader;
