import { Suspense } from 'react';
import StatusPanel from '../../StatusPanel/StatusPanel';
import ShowsPanelData from '../ShowsPanelData/ShowsPanelData';

type ShowsPanelLoaderProps = {
    icon?: React.ReactNode;
    className?: string;
};

const ShowsPanelLoader: React.FC<ShowsPanelLoaderProps> = ({
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
                    label="BINGING"
                    icon={icon}
                    isLoading
                    className={className}
                />
            }
        >
            <ShowsPanelData icon={icon} className={className} />
        </Suspense>
    );
};

export default ShowsPanelLoader;
