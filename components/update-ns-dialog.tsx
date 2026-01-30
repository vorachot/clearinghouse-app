"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import UpdateNamespaceForm from "./update-ns-form";

type Props = {
  namespaceId: string;
  projectId: string;
  setOnClose?: () => void;
};

const UpdateNamespaceDialog = ({
  namespaceId,
  projectId,
  setOnClose,
}: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="dark:text-white flex flex-col gap-1">
          Update Namespace
        </ModalHeader>
        <ModalBody>
          <UpdateNamespaceForm
            namespaceId={namespaceId}
            projectId={projectId}
            setOnClose={setOnClose}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default UpdateNamespaceDialog;
