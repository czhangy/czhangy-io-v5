import GlitchText from '@/components/common/GlitchText/GlitchText';
import RAWGHelpers from '@/lib/utils/RAWGHelpers';
import { prisma } from '@/lib/utils/shared/prisma';
import {
    GameEntry,
    RAWGGame,
    ShowEntry,
    SkillEntry,
    TVmazeShow,
} from '@/lib/utils/shared/types';
import TVmazeHelpers from '@/lib/utils/TVmazeHelpers';
import type { StatusItem } from '@/generated/prisma/client';
import GamePanel from './GamePanel/GamePanel';
import LocationPanel from './LocationPanel/LocationPanel';
import ShowsPanel from './ShowsPanel/ShowsPanel';
import SkillPanel from './SkillPanel/SkillPanel';
import SpotifyPanel from './SpotifyPanel/SpotifyPanel';
import styles from './StatusPage.module.scss';

const StatusPage = async () => {
    // -------------------------------------------------------------------------
    // CONSTANTS
    // -------------------------------------------------------------------------

    const DEFAULT_GAME_ENTRY: GameEntry = { name: 'Something', rawgId: -1 };
    const DEFAULT_SKILL_ENTRY: SkillEntry = {
        name: 'Something',
        category: 'Coding',
    };
    const DEFAULT_SHOW_ENTRIES: ShowEntry[] = [
        { name: '???', tvmazeId: -1 },
        { name: '???', tvmazeId: -1 },
        { name: '???', tvmazeId: -1 },
        { name: '???', tvmazeId: -1 },
    ];

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const [locationItem, gameItem, showsItem, skillItem]: [
        StatusItem | null,
        StatusItem | null,
        StatusItem | null,
        StatusItem | null,
    ] = await Promise.all([
        prisma.statusItem.findUnique({ where: { key: 'location' } }),
        prisma.statusItem.findUnique({ where: { key: 'game' } }),
        prisma.statusItem.findUnique({ where: { key: 'shows' } }),
        prisma.statusItem.findUnique({ where: { key: 'skill' } }),
    ]);

    const location: string = locationItem?.value ?? 'Somewhere';
    const gameEntry: GameEntry = gameItem
        ? JSON.parse(gameItem.value)
        : DEFAULT_GAME_ENTRY;
    const showEntries: ShowEntry[] = showsItem
        ? JSON.parse(showsItem.value)
        : DEFAULT_SHOW_ENTRIES;
    const skillEntry: SkillEntry = skillItem
        ? JSON.parse(skillItem.value)
        : DEFAULT_SKILL_ENTRY;

    const [gameMeta, showsMeta]: [RAWGGame | null, (TVmazeShow | null)[]] =
        await Promise.all([
            RAWGHelpers.getGameById(gameEntry.rawgId),
            Promise.all(
                showEntries.map((e) => TVmazeHelpers.getShowById(e.tvmazeId))
            ),
        ]);

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['status-page']}>
            <div className={styles.content}>
                <GlitchText text="STATUS" as="h1" className={styles.title} />
                <div className={styles.grid}>
                    <LocationPanel
                        initialLocation={location}
                        className={styles['cols-4']}
                    />
                    <SpotifyPanel className={styles['cols-6']} />
                    <ShowsPanel
                        initialEntries={showEntries}
                        initialMeta={showsMeta}
                        className={`${styles['cols-6']} ${styles['rows-3']}`}
                    />
                    <GamePanel
                        initialEntry={gameEntry}
                        initialMeta={gameMeta}
                        className={styles['cols-5']}
                    />
                    <SkillPanel
                        initialEntry={skillEntry}
                        className={styles['cols-5']}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
