import { Suspense } from 'react';
import StatusPanel from '../../StatusPanel/StatusPanel';
import SkillPanelData from '../SkillPanelData/SkillPanelData';

type SkillPanelLoaderProps = {
    icon?: React.ReactNode;
    className?: string;
};

const SkillPanelLoader: React.FC<SkillPanelLoaderProps> = ({
    icon,
    className,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Suspense
            fallback={
                <StatusPanel
                    label="LEARNING"
                    icon={icon}
                    isLoading
                    className={className}
                />
            }
        >
            <SkillPanelData icon={icon} className={className} />
        </Suspense>
    );
};

export default SkillPanelLoader;
