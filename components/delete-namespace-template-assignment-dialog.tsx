"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { useState } from "react";
import { WarningRounded } from "@mui/icons-material";

interface DeleteNamespaceTemplateAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  templateName: string;
  namespaceName: string;
}

export default function DeleteNamespaceTemplateAssignmentDialog({
  isOpen,
  onClose,
  onConfirm,
  templateName,
  namespaceName,
}: DeleteNamespaceTemplateAssignmentDialogProps) {
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsUnassigning(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to unassign template");
      console.error("Error unassigning template:", err);
    } finally {
      setIsUnassigning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <WarningRounded className="text-warning" />
            <span>Unassign Template</span>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to unassign the template{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {templateName}
            </span>{" "}
            from namespace{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {namespaceName}
            </span>
            ?
          </p>
          {/* <p className="text-sm text-warning-600 dark:text-warning-400 mt-2">
            This will remove the template assignment but will not delete existing quotas.
          </p> */}
          {error && (
            <div className="mt-4 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-sm text-danger-600 dark:text-danger-400">
                {error}
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            isDisabled={isUnassigning}
          >
            Cancel
          </Button>
          <Button
            color="warning"
            onPress={handleConfirm}
            isLoading={isUnassigning}
          >
            Unassign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
