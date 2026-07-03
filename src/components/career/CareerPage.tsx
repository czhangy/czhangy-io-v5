import GlitchText from '@/components/common/GlitchText/GlitchText';
import { JOBS } from '@/lib/static/job-data';
import styles from './CareerPage.module.scss';
import JobCard from './JobCard/JobCard';

const CareerPage: React.FC = () => {
    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['career-page']}>
            <div className={styles.content}>
                <GlitchText text="CAREER" className={styles.title} />
                <div className={styles.timeline}>
                    {JOBS.map((job) => (
                        <div
                            key={`${job.company}-${job.startDate}`}
                            className={styles['timeline-entry']}
                        >
                            <div className={styles.gutter}>
                                <span className={styles.dot} />
                            </div>
                            <div className={styles['card-wrapper']}>
                                <JobCard job={job} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareerPage;
