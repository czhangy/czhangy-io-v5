import { Suspense } from 'react';
import TVIcon from '@/lib/icons/TVIcon';
import StatusPanel from '../../StatusPanel/StatusPanel';
import ShowsPanelData from '../ShowsPanelData/ShowsPanelData';

type ShowsPanelLoaderProps = {
    className?: string;
};

const ShowsPanelLoader: React.FC<ShowsPanelLoaderProps> = ({ className }) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const LABEL: string = 'WATCHING';
    const ICON: React.ReactNode = <TVIcon />;

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
            <ShowsPanelData label={LABEL} icon={ICON} className={className} />
        </Suspense>
    );
};

export default ShowsPanelLoader;
