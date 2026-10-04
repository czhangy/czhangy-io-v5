'use client';

import Modal from '@/components/common/Modal/Modal';
import ProjectForm from '@/components/projects/ProjectsContent/ProjectForm/ProjectForm';
import { CreateProjectParams, Project } from '@/lib/static/types';
import ProjectHelpers from '@/lib/utils/ProjectHelpers';

type AddProjectModalProps = {
    onClose: () => void;
    onAdd: (project: Project) => void;
};

const AddProjectModal: React.FC<AddProjectModalProps> = ({
    onClose,
    onAdd,
}) => {
    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------

    const handleSubmit = async (values: CreateProjectParams): Promise<void> => {
        const created = await ProjectHelpers.create(values);
        onAdd(created);
        onClose();
    };

    // -------------------------------------------------------------------------
    // MARKUP
    // -------------------------------------------------------------------------

    return (
        <Modal title="ADD PROJECT" onClose={onClose}>
            <ProjectForm
                submitLabel="Add"
                onSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
};

export default AddProjectModal;
