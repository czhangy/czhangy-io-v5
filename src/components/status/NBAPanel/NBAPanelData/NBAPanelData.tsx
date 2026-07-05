import Image from 'next/image';
import StatusPanel from '@/components/status/StatusPanel/StatusPanel';
import { NBAGameResponse } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import NBAHelpers from '@/lib/utils/NBAHelpers';
import styles from './NBAPanelData.module.scss';

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
    // RENDERING
    // -------------------------------------------------------------------------

    const game: NBAGameResponse | null = await NBAHelpers.getLastWarriorsGame();

    const isRecent: boolean = !!game && DateHelpers.isWithinDays(game.date, 15);

    const warriorsAreHome: boolean = game?.home.isWarriors ?? false;
    const warriors = warriorsAreHome ? game?.home : game?.away;
    const opponent = warriorsAreHome ? game?.away : game?.home;
    const matchup: string =
        warriors && opponent
            ? `${warriors.abbreviation} ${warriorsAreHome ? 'vs.' : '@'} ${opponent.abbreviation}`
            : '';

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
        >
            {game && isRecent ? (
                <div className={styles.game}>
                    <div className={styles['team-block']}>
                        <Image
                            className={styles.logo}
                            src={warriors!.logo}
                            alt={`${warriors!.displayName} logo`}
                            width={56}
                            height={56}
                        />
                        <span className={styles.standing}>
                            {warriors!.standing}
                        </span>
                        <span className={styles.record}>
                            {warriors!.record}
                            {warriors!.streak ? ` (${warriors!.streak})` : ''}
                        </span>
                    </div>
                    <div className={styles.center}>
                        <span className={styles.matchup}>{matchup}</span>
                        <div className={styles.scores}>
                            <span
                                className={`${styles.score}${warriors!.isWinner ? ` ${styles['score--winner']}` : ''}`}
                            >
                                {warriors!.score}
                            </span>
                            <span className={styles.separator}>–</span>
                            <span
                                className={`${styles.score}${opponent!.isWinner ? ` ${styles['score--winner']}` : ''}`}
                            >
                                {opponent!.score}
                            </span>
                        </div>
                        <span className={styles.meta}>
                            {DateHelpers.getHumanReadableDate(game.date)}
                        </span>
                    </div>
                    <div className={styles['team-block']}>
                        <Image
                            className={styles.logo}
                            src={opponent!.logo}
                            alt={`${opponent!.displayName} logo`}
                            width={56}
                            height={56}
                        />
                        <span className={styles.standing}>
                            {opponent!.standing}
                        </span>
                        <span className={styles.record}>
                            {opponent!.record}
                            {opponent!.streak ? ` (${opponent!.streak})` : ''}
                        </span>
                    </div>
                </div>
            ) : (
                <p className={styles.empty}>No recent Warriors games</p>
            )}
        </StatusPanel>
    );
};

export default NBAPanelData;
