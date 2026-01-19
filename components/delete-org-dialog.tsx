"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { deleteOrganization, getOrganizationById } from "@/api/org";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import useSWR from "swr";
import { WarningRounded } from "@mui/icons-material";

type Props = {
  orgId: string;
  setOnClose?: () => void;
};

const DeleteOrgDialog = ({ orgId, setOnClose }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the organization data to display its name
  const { data: organization, isLoading } = useSWR(
    ["orgs", orgId],
    () => getOrganizationById(orgId),
    {
      revalidateOnFocus: false,
    },
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteOrganization(orgId);
      // Revalidate the organization list
      await mutate(["orgs"], undefined, {
        revalidate: true,
      });
      if (setOnClose) {
        setOnClose();
      }
    } catch (error: any) {
      console.error("Error deleting organization:", error);
      setError(error.response?.data?.error || "Failed to delete organization");
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
            <span>Delete Organization</span>
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
                Are you sure you want to delete the organization{" "}
                <span className="font-semibold text-danger">
                  {organization?.name}
                </span>
                ?
              </p>
              {/* <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone. All projects, namespaces, and
                associated data within this organization will be permanently
                deleted.
              </p> */}
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
export default DeleteOrgDialog;
