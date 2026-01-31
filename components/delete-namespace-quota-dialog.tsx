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
  quotaName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  error?: string | null;
};

const DeleteNamespaceQuotaDialog = ({
  isOpen,
  quotaName,
  onClose,
  onConfirm,
  isDeleting = false,
  error,
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
              Delete Namespace Quota
            </span>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-3">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the namespace quota{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {quotaName}
              </span>
              ?
            </p>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. All resource allocations associated
              with this namespace quota will be permanently removed.
            </p> */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
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
            {isDeleting ? "Deleting..." : "Delete Quota"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteNamespaceQuotaDialog;
