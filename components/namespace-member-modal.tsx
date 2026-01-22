import { User } from "@/context/UserContext";
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
} from "@mui/icons-material";
import { useState } from "react";
import { removeMembersFromNamespace } from "@/api/member";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  setOpenMembersModal: (open: boolean) => void;
  members?: User[];
  namespaceId?: string;
};

const NamespaceMemberModal = ({
  isOpen,
  setOpenMembersModal,
  members,
  namespaceId,
}: Props) => {
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set([]),
  );
  const [isRemoving, setIsRemoving] = useState(false);

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
    if (selectedMembers.size === 0 || !namespaceId) return;

    setIsRemoving(true);
    try {
      await removeMembersFromNamespace({
        namespace_id: namespaceId,
        members: Array.from(selectedMembers),
      });
      setSelectedMembers(new Set([]));
      await mutate(["namespace", namespaceId]);
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
            Namespace Members ({members?.length || 0})
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
              {members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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
                  <Chip size="sm" color="success" variant="flat">
                    Member
                  </Chip>
                </div>
              ))}
            </div>
          </ScrollShadow>
        </ModalBody>
        <ModalFooter>
          {selectedMembers.size > 0 && (
            <Button
              color="danger"
              variant="flat"
              startContent={<PersonRemoveRounded />}
              onPress={handleRemoveMembers}
              isLoading={isRemoving}
            >
              Remove {selectedMembers.size} Member
              {selectedMembers.size !== 1 ? "s" : ""}
            </Button>
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
export default NamespaceMemberModal;
