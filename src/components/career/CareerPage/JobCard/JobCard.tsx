import Image from 'next/image';
import { Job } from '@/lib/static/jobs';
import styles from './JobCard.module.scss';

type JobCardProps = {
    job: Job;
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const renderDates = (): React.ReactNode => (
        <span className={styles.dates}>
            {job.startDate}
            {' – '}
            {job.endDate ? (
                job.endDate
            ) : (
                <span className={styles.present}>Present</span>
            )}
        </span>
    );

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['job-card']}>
            <div className={styles['logo-wrapper']}>
                <Image
                    src={job.logo}
                    alt={`${job.company} logo`}
                    width={40}
                    height={40}
                    className={styles.logo}
                />
            </div>
            <div className={styles.content}>
                <span className={styles.company}>{job.company}</span>
                <span className={styles.role}>{job.title}</span>
                {renderDates()}
            </div>
        </div>
    );
};

export default JobCard;
