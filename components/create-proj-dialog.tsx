"use client";

import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import ProjForm from "./proj-form";

type Props = {
  orgId?: string;
  setOnClose?: () => void;
};

const CreateProjDialog = ({ orgId, setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Create Project
        </ModalHeader>
        <ModalBody>
          <ProjForm orgId={orgId} setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default CreateProjDialog;
