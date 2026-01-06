"use client";

import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import OrgForm from "./org-form";

type Props = {
  setOnClose?: () => void;
};

const CreateOrgDialog = ({ setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Create Organization
        </ModalHeader>
        <ModalBody>
          <OrgForm setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default CreateOrgDialog;
