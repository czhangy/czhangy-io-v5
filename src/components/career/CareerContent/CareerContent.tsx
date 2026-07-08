'use client';

import { useState } from 'react';
import JobCard from '@/components/career/JobCard/JobCard';
import Controls from '@/components/common/Controls/Controls';
import { useSession } from '@/lib/context/SessionContext';
import { Job } from '@/lib/static/types';
import DateHelpers from '@/lib/utils/DateHelpers';
import AddJobModal from './AddJobModal/AddJobModal';
import styles from './CareerContent.module.scss';
import EditJobModal from './EditJobModal/EditJobModal';

type CareerContentProps = {
    jobs: Job[];
};

const CareerContent: React.FC<CareerContentProps> = ({ jobs: initialJobs }) => {
    // -------------------------------------------------------------------------
    // HOOKS
    // -------------------------------------------------------------------------

    const { role } = useSession();

    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------

    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleAdd = (job: Job): void => {
        setJobs((prev) =>
            [...prev, job].sort(
                (a, b) => getSortTimestamp(b) - getSortTimestamp(a)
            )
        );
    };

    const handleUpdate = (updated: Job): void => {
        setJobs((prev) =>
            prev
                .map((j) => (j.id === updated.id ? updated : j))
                .sort((a, b) => getSortTimestamp(b) - getSortTimestamp(a))
        );
        setEditingJob(null);
    };

    const handleDelete = async (id: number): Promise<void> => {
        const res = await fetch(`/api/career/${id}`, { method: 'DELETE' });
        if (!res.ok) return;
        setJobs((prev) => prev.filter((j) => j.id !== id));
    };

    // -------------------------------------------------------------------------
    // COMPUTATIONS
    // -------------------------------------------------------------------------

    const getSortTimestamp = (job: Job): number =>
        job.endDate ? DateHelpers.getUnixTimestamp(job.endDate) : Infinity;

    // -------------------------------------------------------------------------
    // RENDERING
    // -------------------------------------------------------------------------

    const isAdmin: boolean = role === 'ADMIN';

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <div className={styles['career-content']}>
            <Controls
                add={{
                    label: 'Add Job',
                    isAdmin,
                    onClick: () => setIsAddOpen(true),
                }}
            >
                {isAddOpen ? (
                    <AddJobModal
                        onClose={() => setIsAddOpen(false)}
                        onAdd={handleAdd}
                    />
                ) : null}
            </Controls>
            <div className={styles.timeline}>
                {jobs.map((job) => (
                    <div key={job.id} className={styles['timeline-entry']}>
                        <div className={styles.gutter}>
                            <span className={styles.dot} />
                        </div>
                        <div className={styles['card-wrapper']}>
                            <JobCard
                                job={job}
                                isAdmin={isAdmin}
                                onEdit={() => setEditingJob(job)}
                                onDelete={() => handleDelete(job.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {editingJob ? (
                <EditJobModal
                    job={editingJob}
                    onClose={() => setEditingJob(null)}
                    onEdit={handleUpdate}
                />
            ) : null}
        </div>
    );
};

export default CareerContent;
