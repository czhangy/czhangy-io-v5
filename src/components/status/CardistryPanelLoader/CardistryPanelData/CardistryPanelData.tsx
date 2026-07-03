import { prisma } from '@/lib/static/prisma';
import { SkillEntry } from '@/lib/static/types';
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
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_SKILL_ENTRY: SkillEntry = {
        name: 'Something',
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const fetchSkillEntry = async (): Promise<SkillEntry> => {
        try {
            const item = await prisma.statusItem.findUnique({
                where: { key: 'skill' },
            });
            if (item) return JSON.parse(item.value) as SkillEntry;
        } catch {}
        return DEFAULT_SKILL_ENTRY;
    };

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const skillEntry: SkillEntry = await fetchSkillEntry();

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <CardistryPanel
            initialEntry={skillEntry}
            label={label}
            icon={icon}
            cols={cols}
            rows={rows}
        />
    );
};

export default CardistryPanelData;
