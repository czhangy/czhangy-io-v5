import GlitchText from '@/components/common/GlitchText/GlitchText';
import { prisma } from '@/lib/static/prisma';
import { Job } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import CareerContent from './CareerContent/CareerContent';
import styles from './CareerPage.module.scss';

const CareerPage = async () => {
    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const getSortTimestamp = (job: Job): number =>
        job.endDate ? DateHelpers.getUnixTimestamp(job.endDate) : Infinity;

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const records = await prisma.jobs.findMany();

    const jobs: Job[] = records
        .map((r) => ({
            id: r.id,
            company: r.company,
            title: r.title,
            startDate: r.startDate,
            endDate: r.endDate,
            logo: r.logo,
        }))
        .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a));

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['career-page']}>
            <div className={styles.content}>
                <GlitchText text="CAREER" className={styles.title} />
                <CareerContent jobs={jobs} />
            </div>
        </div>
    );
};

export default CareerPage;
