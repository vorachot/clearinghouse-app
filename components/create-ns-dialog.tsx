"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import NsForm from "./ns-form";

type Props = {
  orgId?: string;
  projectId?: string;
  setOnClose?: () => void;
};

const CreateNsDialog = ({ orgId, projectId, setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className=" dark:text-white flex flex-col gap-1">
          Create Namespace
        </ModalHeader>
        <ModalBody>
          <NsForm orgId={orgId} projectId={projectId} setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default CreateNsDialog;
