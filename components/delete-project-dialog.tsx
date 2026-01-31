"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { WarningRounded } from "@mui/icons-material";

type Props = {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  error?: string | null;
};

const DeleteProjectDialog = ({
  isOpen,
  projectName,
  onClose,
  onConfirm,
  isDeleting = false,
  error = null,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <WarningRounded className="!w-6 !h-6 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-gray-900 dark:text-white">
              Delete Project
            </span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the project{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {projectName}
              </span>
              ?
            </p>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. All project data, including quotas
              and member assignments, will be permanently removed.
            </p> */}
            {error && (
              <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                <p className="text-sm text-danger-700 dark:text-danger-400">
                  {error}
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isDeleting}
            isDisabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Project"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteProjectDialog;
