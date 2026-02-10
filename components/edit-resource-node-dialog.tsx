"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { EditRounded } from "@mui/icons-material";

type EditResourceNodeDialogProps = {
  isOpen: boolean;
  nodeId: string;
  nodeName: string;
  onClose: () => void;
  onConfirm: (nodeId: string, data: { name: string }) => void;
  isUpdating?: boolean;
  error?: string | null;
};

const EditResourceNodeDialog = ({
  isOpen,
  nodeId,
  nodeName,
  onClose,
  onConfirm,
  isUpdating = false,
  error,
}: EditResourceNodeDialogProps) => {
  const [name, setName] = useState(nodeName);

  useEffect(() => {
    if (isOpen) {
      setName(nodeName);
    }
  }, [isOpen, nodeName]);

  const handleSubmit = () => {
    onConfirm(nodeId, { name });
  };

  const isFormValid = name.trim() !== "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <EditRounded />
          <span>Edit Resource Node</span>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}
          <Input
            label="Node Name"
            placeholder="Enter node name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isUpdating}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isUpdating}
            isDisabled={!isFormValid || isUpdating}
          >
            Update Node
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditResourceNodeDialog;
