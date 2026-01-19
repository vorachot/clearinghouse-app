"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import UpdateOrgForm from "./update-org-form";

type Props = {
  orgId: string;
  setOnClose?: () => void;
};

const UpdateOrgDialog = ({ orgId, setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="dark:text-white flex flex-col gap-1">
          Update Organization
        </ModalHeader>
        <ModalBody>
          <UpdateOrgForm orgId={orgId} setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default UpdateOrgDialog;
