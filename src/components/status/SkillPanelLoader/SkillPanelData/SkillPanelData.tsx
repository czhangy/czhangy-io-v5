import { prisma } from '@/lib/static/prisma';
import { SkillEntry } from '@/lib/static/types';
import SkillPanel from './SkillPanel/SkillPanel';

type SkillPanelDataProps = {
    label: string;
    icon: React.ReactNode;
    className?: string;
};

const SkillPanelData = async ({
    label,
    icon,
    className,
}: SkillPanelDataProps) => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_SKILL_ENTRY: SkillEntry = {
        name: 'Something',
        category: 'Coding',
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
        <SkillPanel
            initialEntry={skillEntry}
            label={label}
            icon={icon}
            className={className}
        />
    );
};

export default SkillPanelData;
