"use client";

import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import ProjForm from "./proj-form";
import NsForm from "./ns-form";

type Props = {
  orgId?: string;
  projectId?: string;
  setOnClose?: () => void;
};

const CreateNsDialog = ({ orgId, projectId, setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="xs" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <h2 className="text-2xl font-bold dark:text-white">New Namespace</h2>
        </ModalHeader>
        <Divider />
        <ModalBody className="py-6">
          <NsForm orgId={orgId} projectId={projectId} setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default CreateNsDialog;
