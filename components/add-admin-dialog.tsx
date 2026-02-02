"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { AdminPanelSettingsRounded } from "@mui/icons-material";
import { addAdminToOrganization, getMembers } from "@/api/member";
import { mutate } from "swr";
import useSWR from "swr";
import Loading from "@/app/loading";
import { User } from "@/context/UserContext";

interface AddAdminDialogProps {
  orgId?: string;
  onClose?: () => void;
  existingAdmins?: User[];
}

const AddAdminDialog = ({
  orgId,
  onClose,
  existingAdmins = [],
}: AddAdminDialogProps) => {
  const [selectedAdmins, setSelectedAdmins] = useState<Set<string>>(
    new Set([]),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: allMembers, isLoading } = useSWR<User[]>(
    "members",
    getMembers,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  // Filter out users who are already admins
  const existingAdminIds = new Set(existingAdmins.map((a) => a.id));
  const availableUsers =
    allMembers?.filter((member) => !existingAdminIds.has(member.id)) || [];

  const handleSubmit = async () => {
    if (selectedAdmins.size === 0) return;

    setIsSubmitting(true);

    const data = {
      organization_id: orgId ?? "",
      admins: Array.from(selectedAdmins),
    };

    try {
      await addAdminToOrganization(data);
      if (onClose) {
        onClose();
      }
      await mutate(["orgs", orgId]);
    } catch (error) {
      console.error("Error adding admins to organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen onClose={onClose} size="md">
        <ModalContent>
          <ModalBody className="py-8">
            <Loading />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen onClose={onClose} size="md" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <AdminPanelSettingsRounded className="!w-6 !h-6 text-blue-600" />
          Add Admins to Organization
        </ModalHeader>
        <ModalBody>
          {availableUsers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                No available users to add as admins
              </p>
            </div>
          ) : (
            <Select
              label="Select Users to Add as Admins"
              placeholder="Choose users to add as admins"
              selectionMode="multiple"
              selectedKeys={selectedAdmins}
              onSelectionChange={(keys) =>
                setSelectedAdmins(keys as Set<string>)
              }
              variant="bordered"
              isRequired
              classNames={{
                trigger: "min-h-unit-12",
                listbox: "max-h-[300px]",
              }}
            >
              {availableUsers.map((member) => (
                <SelectItem
                  key={member.id}
                  textValue={`${member.first_name} ${member.last_name} (${member.email})`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {member.first_name} {member.last_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {member.email}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={selectedAdmins.size === 0}
            onPress={handleSubmit}
          >
            Add {selectedAdmins.size > 0 && `(${selectedAdmins.size})`} Admin
            {selectedAdmins.size !== 1 ? "s" : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AddAdminDialog;
