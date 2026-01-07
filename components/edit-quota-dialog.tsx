"use client";

import { Divider } from "@heroui/divider";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import QuotaForm from "./quota-form";

type Props = {
  projectId?: string;
  setOnClose?: () => void;
};

const EditQuotaDialog = ({ projectId, setOnClose }: Props) => {
  return (
    <Modal isOpen={true} scrollBehavior="inside" size="xs" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className=" dark:text-white flex flex-col gap-1 pb-2">
          <h2 className="text-2xl font-bold dark:text-white">Quota Limits</h2>
        </ModalHeader>
        <Divider />
        <ModalBody className="py-6">
          <QuotaForm projectId={projectId} setOnClose={setOnClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditQuotaDialog;
