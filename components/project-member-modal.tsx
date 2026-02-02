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
  AdminPanelSettingsRounded,
} from "@mui/icons-material";
import { useState } from "react";
import {
  removeMembersFromProject,
  addAdminToProject,
  removeAdminFromProject,
} from "@/api/member";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  setOpenMembersModal: (open: boolean) => void;
  members?: User[];
  admins?: User[];
  projectId?: string;
};

const ProjectMemberModal = ({
  isOpen,
  setOpenMembersModal,
  members,
  admins,
  projectId,
}: Props) => {
  const { user: currentUser } = useUser();
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set([]),
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [isDemoting, setIsDemoting] = useState(false);

  // Track admin and member IDs separately
  const adminIds = new Set(admins?.map((a) => a.id) || []);
  const memberIds = new Set(members?.map((m) => m.id) || []);

  // Combine admins and members with role information
  const allUsers = [
    ...(admins?.map((admin) => ({ ...admin, role: "admin" as const })) || []),
    ...(members?.map((member) => ({ ...member, role: "member" as const })) ||
      []),
  ];

  // Deduplicate by user id, keeping admin role priority
  const uniqueUsers = Array.from(
    allUsers.reduce((map, user) => {
      const existing = map.get(user.id);
      if (!existing || user.role === "admin") {
        map.set(user.id, user);
      }
      return map;
    }, new Map<string, (typeof allUsers)[0]>()),
  ).map(([_, user]) => user);

  // Sort admins first
  const sortedUsers = uniqueUsers.sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return 0;
  });

  // Check if any selected users are in members list
  const hasSelectedMembers = Array.from(selectedMembers).some((id) =>
    memberIds.has(id),
  );

  // Check if any selected users are admins
  const hasSelectedAdmins = Array.from(selectedMembers).some((id) =>
    adminIds.has(id),
  );

  const handleToggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId);
    } else {
      newSelected.add(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handlePromoteToAdmin = async () => {
    if (selectedMembers.size === 0 || !projectId) return;

    setIsPromoting(true);
    try {
      await addAdminToProject({
        project_id: projectId,
        admins: Array.from(selectedMembers),
      });
      setSelectedMembers(new Set([]));
      await mutate(["project", projectId]);
      setOpenMembersModal(false);
    } catch (error) {
      console.error("Error promoting to admin:", error);
    } finally {
      setIsPromoting(false);
    }
  };

  const handleDemoteFromAdmin = async () => {
    if (selectedMembers.size === 0 || !projectId) return;

    setIsDemoting(true);
    try {
      await removeAdminFromProject({
        project_id: projectId,
        admins: Array.from(selectedMembers),
      });
      setSelectedMembers(new Set([]));
      await mutate(["project", projectId]);
      setOpenMembersModal(false);
    } catch (error) {
      console.error("Error demoting from admin:", error);
    } finally {
      setIsDemoting(false);
    }
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
      setOpenMembersModal(false);
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
        setOpenMembersModal(false);
      }}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
          <span className="dark:text-white">
            Project Members ({sortedUsers.length})
          </span>
          {selectedMembers.size > 0 && (
            <Chip size="sm" color="primary" variant="flat">
              {selectedMembers.size} selected
            </Chip>
          )}
        </ModalHeader>
        <ModalBody className="p-0">
          <ScrollShadow className="max-h-[60vh]">
            <div className="p-4 space-y-2">
              {sortedUsers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleToggleMember(member.id)}
                >
                  <Checkbox
                    isSelected={selectedMembers.has(member.id)}
                    onValueChange={() => handleToggleMember(member.id)}
                  />
                  <PersonRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {member.email}
                    </p>
                  </div>
                  <Chip
                    size="sm"
                    color={member.role === "admin" ? "primary" : "success"}
                    variant="flat"
                  >
                    {member.role === "admin" ? "Admin" : "Member"}
                  </Chip>
                </div>
              ))}
            </div>
          </ScrollShadow>
        </ModalBody>
        <ModalFooter>
          {selectedMembers.size > 0 && (
            <>
              {/* Check if selected users are members (can be promoted) */}
              {/* {Array.from(selectedMembers).every(
                (id) => sortedUsers.find((u) => u.id === id)?.role === "member",
              ) && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={handlePromoteToAdmin}
                  isLoading={isPromoting}
                >
                  Promote to Admin
                </Button>
              )} */}
              {/* Show remove from admins if any selected users are admins */}
              {hasSelectedAdmins && (
                <Button
                  color="warning"
                  variant="flat"
                  startContent={<AdminPanelSettingsRounded />}
                  onPress={handleDemoteFromAdmin}
                  isLoading={isDemoting}
                  isDisabled={
                    (currentUser && selectedMembers.has(currentUser.id)) ||
                    false
                  }
                >
                  {currentUser && selectedMembers.has(currentUser.id)
                    ? "Cannot Remove Yourself from Admins"
                    : `Remove from Admins (${selectedMembers.size})`}
                </Button>
              )}
              {/* Show remove from members if any selected users are members */}
              {hasSelectedMembers && (
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<PersonRemoveRounded />}
                  onPress={handleRemoveMembers}
                  isLoading={isRemoving}
                >
                  {currentUser && selectedMembers.has(currentUser.id)
                    ? `Remove Yourself from Members${selectedMembers.size > 1 ? ` (and ${selectedMembers.size - 1} other${selectedMembers.size > 2 ? "s" : ""})` : ""}`
                    : `Remove from Members (${selectedMembers.size})`}
                </Button>
              )}
            </>
          )}
          <Button
            color="success"
            variant="flat"
            onPress={() => {
              setSelectedMembers(new Set([]));
              setOpenMembersModal(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ProjectMemberModal;
