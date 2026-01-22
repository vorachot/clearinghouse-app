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
import { addMembersToProject, getOrganizationMembers } from "@/api/member";
import { mutate } from "swr";
import useSWR from "swr";
import Loading from "@/app/loading";
import { User } from "@/context/UserContext";

interface AddProjectMemberDialogProps {
  projectId: string;
  orgId: string;
  onClose?: () => void;
  existingMembers?: User[];
}

const AddProjectMemberDialog = ({
  projectId,
  orgId,
  onClose,
  existingMembers = [],
}: AddProjectMemberDialogProps) => {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set([]),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: orgMembers, isLoading } = useSWR<User[]>(
    ["org-members", orgId],
    () => getOrganizationMembers(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  // Filter out members who are already in the project
  const existingMemberIds = new Set(existingMembers.map((m) => m.id));
  const availableMembers =
    orgMembers?.filter((member) => !existingMemberIds.has(member.id)) || [];

  const handleSubmit = async () => {
    if (selectedMembers.size === 0) return;

    setIsSubmitting(true);

    const data = {
      project_id: projectId,
      members: Array.from(selectedMembers),
    };

    try {
      await addMembersToProject(data);
      if (onClose) {
        onClose();
      }
      await mutate(["project", projectId]);
    } catch (error) {
      console.error("Error adding members to project:", error);
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
          Add Members to Project
        </ModalHeader>
        <ModalBody>
          {availableMembers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                No available organization members to add to this project
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
            Only organization members can be added to this project. You can
            select multiple members at once.
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
export default AddProjectMemberDialog;
