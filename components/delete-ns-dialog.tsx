"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { deleteNamespace, getNamespaceById } from "@/api/namespace";
import { useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { WarningRounded } from "@mui/icons-material";

type Props = {
  namespaceId: string;
  projectId: string;
  setOnClose?: () => void;
};

const DeleteNamespaceDialog = ({
  namespaceId,
  projectId,
  setOnClose,
}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the namespace data to display its name
  const { data: namespace, isLoading } = useSWR(
    ["namespaces", namespaceId],
    () => getNamespaceById(namespaceId),
    {
      revalidateOnFocus: false,
    },
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteNamespace(namespaceId);
      await mutate(["namespaces", projectId], undefined, {
        revalidate: true,
      });
      if (setOnClose) {
        setOnClose();
      }
    } catch (error: any) {
      console.error("Error deleting namespace:", error);
      setError(error.response?.data?.error || "Failed to delete namespace");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={true} scrollBehavior="inside" size="md" onClose={setOnClose}>
      <ModalContent>
        <ModalHeader className="dark:text-white flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <WarningRounded className="text-danger !w-6 !h-6" />
            <span>Delete Namespace</span>
          </div>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete the namespace{" "}
                <span className="font-semibold text-danger">
                  {namespace?.name}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone. All resources and data within
                this namespace will be permanently deleted.
              </p>
              {error && (
                <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                  <p className="text-sm text-danger-700 dark:text-danger-400">
                    {error}
                  </p>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={setOnClose}
            isDisabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={isDeleting}
            isDisabled={isLoading}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default DeleteNamespaceDialog;
