import { Suspense } from 'react';
import StatusPanel from '../StatusPanel/StatusPanel';

type SuspendedPanelProps = {
    label: string;
    children: React.ReactNode;
    className?: string;
};

const SuspendedPanel: React.FC<SuspendedPanelProps> = ({
    label,
    children,
    className,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Suspense
            fallback={
                <StatusPanel label={label} isLoading className={className} />
            }
        >
            {children}
        </Suspense>
    );
};

export default SuspendedPanel;
