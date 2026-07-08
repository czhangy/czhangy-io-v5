'use client';

import AdminActions from '@/components/common/AdminActions/AdminActions';
import { Job } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import styles from './JobCard.module.scss';

type JobCardProps = {
    job: Job;
    isAdmin: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

const JobCard: React.FC<JobCardProps> = ({
    job,
    isAdmin,
    onEdit,
    onDelete,
}) => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['job-card']}>
            <div className={styles['logo-wrapper']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
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
                <span className={styles.dates}>
                    {DateHelpers.getMonthYear(job.startDate)}
                    {' – '}
                    {job.endDate
                        ? DateHelpers.getMonthYear(job.endDate)
                        : 'Present'}
                </span>
            </div>
            {isAdmin ? (
                <AdminActions
                    entryName={`${job.company} — ${job.title}`}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ) : null}
        </div>
    );
};

export default JobCard;
