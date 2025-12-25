"use client";

import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import OrgForm from "./org-form";

type Props = {
  setOnClose?: () => void;
};

const CreateOrgDialog = ({ setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="xs" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-2">
          <h2 className="text-2xl font-bold dark:text-white">New Organization</h2>
        </ModalHeader>
        <Divider />
        <ModalBody className="py-6">
          <OrgForm setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default CreateOrgDialog;
