"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import UpdateProjectForm from "./update-project-form";

type Props = {
  projectId: string;
  organizationId: string;
  setOnClose?: () => void;
};

const UpdateProjectDialog = ({
  projectId,
  organizationId,
  setOnClose,
}: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="dark:text-white flex flex-col gap-1">
          Update Project
        </ModalHeader>
        <ModalBody>
          <UpdateProjectForm
            projectId={projectId}
            organizationId={organizationId}
            setOnClose={setOnClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default UpdateProjectDialog;
