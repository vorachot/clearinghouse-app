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
import { PersonAddRounded } from "@mui/icons-material";
import { addMembersToNamespace, getProjectMembers } from "@/api/member";
import { mutate } from "swr";
import useSWR from "swr";
import Loading from "@/app/loading";
import { User } from "@/context/UserContext";

interface AddNamespaceMemberDialogProps {
  namespaceId: string;
  projectId: string;
  onClose?: () => void;
  existingMembers?: User[];
}

const AddNamespaceMemberDialog = ({
  namespaceId,
  projectId,
  onClose,
  existingMembers = [],
}: AddNamespaceMemberDialogProps) => {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set([]),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: projectMembers, isLoading } = useSWR<User[]>(
    ["project-members", projectId],
    () => getProjectMembers(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  // Filter out members who are already in the namespace
  const existingMemberIds = new Set(existingMembers.map((m) => m.id));
  const availableMembers =
    projectMembers?.filter((member) => !existingMemberIds.has(member.id)) || [];

  const handleSubmit = async () => {
    if (selectedMembers.size === 0) return;

    setIsSubmitting(true);

    const data = {
      namespace_id: namespaceId,
      members: Array.from(selectedMembers),
    };

    try {
      await addMembersToNamespace(data);
      if (onClose) {
        onClose();
      }
      await mutate(["namespace", namespaceId]);
    } catch (error) {
      console.error("Error adding members to namespace:", error);
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
          <PersonAddRounded className="!w-6 !h-6 text-green-600" />
          Add Members to Namespace
        </ModalHeader>
        <ModalBody>
          {availableMembers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                No available project members to add to this namespace
              </p>
            </div>
          ) : (
            <Select
              label="Select Members"
              placeholder="Choose members to add"
              selectionMode="multiple"
              selectedKeys={selectedMembers}
              onSelectionChange={(keys) =>
                setSelectedMembers(keys as Set<string>)
              }
              variant="bordered"
              isRequired
              classNames={{
                trigger: "min-h-unit-12",
                listbox: "max-h-[300px]",
              }}
            >
              {availableMembers.map((member) => (
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Only project members can be added to this namespace. You can select
            multiple members at once.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="success"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={selectedMembers.size === 0}
            onPress={handleSubmit}
          >
            Add {selectedMembers.size > 0 && `(${selectedMembers.size})`} Member
            {selectedMembers.size !== 1 ? "s" : ""}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AddNamespaceMemberDialog;
