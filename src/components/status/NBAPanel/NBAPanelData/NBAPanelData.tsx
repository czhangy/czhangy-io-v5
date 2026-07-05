import StatusPanel from '@/components/status/StatusPanel/StatusPanel';

type NBAPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
    mobileOrder?: number;
};

const NBAPanelData = async ({
    label,
    icon,
    cols,
    rows,
    mobileOrder,
}: NBAPanelDataProps) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <StatusPanel
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
            mobileOrder={mobileOrder}
        />
    );
};

export default NBAPanelData;
