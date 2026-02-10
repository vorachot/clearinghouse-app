import { User, useUser } from "@/context/UserContext";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Checkbox } from "@heroui/checkbox";
import {
  GroupRounded,
  PersonRounded,
  PersonRemoveRounded,
  PersonAddRounded,
} from "@mui/icons-material";
import { useState } from "react";
import { removeMembersFromProject } from "@/api/member";
import { mutate } from "swr";
import useSWR from "swr";
import { getProjectById } from "@/api/project";
import Loading from "@/app/loading";

type Props = {
  isOpen: boolean;
  setOpenModal: (open: boolean) => void;
  members?: User[];
  admins?: User[];
  projectId?: string;
  orgId?: string;
  onAddMember?: () => void;
};

const ProjectMembersOnlyModal = ({
  isOpen,
  setOpenModal,
  members,
  admins,
  projectId,
  orgId,
  onAddMember,
}: Props) => {
  const { user: currentUser } = useUser();
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set([]),
  );
  const [isRemoving, setIsRemoving] = useState(false);

  // Fetch fresh project data
  const { data: projectData, isLoading } = useSWR(
    projectId ? ["project", projectId] : null,
    () => (projectId ? getProjectById(projectId) : null),
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
    },
  );

  const currentMembers = projectData?.members || members || [];
  const currentAdmins = projectData?.admins || admins || [];

  const adminIds = new Set(currentAdmins.map((a: User) => a.id));
  const isCurrentUserAdmin = currentUser && adminIds.has(currentUser.id);
  const sortedMembers = currentMembers;

  const handleToggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleRemoveMembers = async () => {
    if (selectedMembers.size === 0 || !projectId) return;

    setIsRemoving(true);
    try {
      await removeMembersFromProject({
        project_id: projectId,
        members: Array.from(selectedMembers),
      });
      setSelectedMembers(new Set([]));
      await mutate(["project", projectId]);
      if (orgId) await mutate(["orgs", orgId, "projects"]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error removing members:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedMembers(new Set([]));
        setOpenModal(false);
      }}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {isLoading ? (
          <ModalBody className="py-8">
            <Loading />
          </ModalBody>
        ) : (
          <>
            <ModalHeader className="flex gap-2 items-center">
              <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
              <span className="dark:text-white">
                Project Members ({sortedMembers.length})
              </span>
              {selectedMembers.size > 0 && (
                <Chip size="sm" color="success" variant="flat">
                  {selectedMembers.size} selected
                </Chip>
              )}
            </ModalHeader>
            <ModalBody className="p-0">
              <ScrollShadow className="max-h-[60vh]">
                <div className="p-4 space-y-2">
                  {sortedMembers.length > 0 ? (
                    sortedMembers.map((member: User) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          isCurrentUserAdmin
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            : ""
                        }`}
                        onClick={
                          isCurrentUserAdmin
                            ? () => handleToggleMember(member.id)
                            : undefined
                        }
                      >
                        {isCurrentUserAdmin && (
                          <Checkbox
                            isSelected={selectedMembers.has(member.id)}
                            onValueChange={() => handleToggleMember(member.id)}
                          />
                        )}
                        <PersonRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {member.email}
                          </p>
                        </div>
                        <Chip size="sm" color="success" variant="flat">
                          Member
                        </Chip>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <GroupRounded className="!w-12 !h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        No members in this project
                      </p>
                    </div>
                  )}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              {isCurrentUserAdmin && onAddMember && (
                <Button
                  color="success"
                  variant="flat"
                  startContent={<PersonAddRounded />}
                  onPress={() => {
                    onAddMember();
                    setOpenModal(false);
                  }}
                >
                  Add Member
                </Button>
              )}
              {isCurrentUserAdmin && selectedMembers.size > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<PersonRemoveRounded />}
                  onPress={handleRemoveMembers}
                  isLoading={isRemoving}
                >
                  {currentUser && selectedMembers.has(currentUser.id)
                    ? `Remove Yourself${selectedMembers.size > 1 ? ` (and ${selectedMembers.size - 1} other${selectedMembers.size > 2 ? "s" : ""})` : ""}`
                    : `Remove ${selectedMembers.size} Member${selectedMembers.size !== 1 ? "s" : ""}`}
                </Button>
              )}
              <Button
                color="success"
                variant="flat"
                onPress={() => {
                  setSelectedMembers(new Set([]));
                  setOpenModal(false);
                }}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ProjectMembersOnlyModal;
