import { prisma } from '@/lib/static/prisma';
import { CardistryMoveEntry } from '@/lib/static/types';
import CardistryPanel from './CardistryPanel/CardistryPanel';

type CardistryPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    cols: number;
    rows?: number;
};

const CardistryPanelData = async ({
    label,
    icon,
    cols,
    rows,
}: CardistryPanelDataProps) => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchActiveMove = async (): Promise<CardistryMoveEntry | null> => {
        try {
            const move = await prisma.cardistryMove.findFirst({
                where: { isActive: true },
            });
            return move ?? null;
        } catch {}
        return null;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const activeMove: CardistryMoveEntry | null = await fetchActiveMove();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <CardistryPanel
            initialMove={activeMove}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
        />
    );
};

export default CardistryPanelData;
