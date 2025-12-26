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
import { GroupRounded, PersonRounded } from "@mui/icons-material";

type Props = {
  isOpen: boolean;
  setOpenMembersModal: (open: boolean) => void;
  members?: User[];
};

const MemberModal = ({ isOpen, setOpenMembersModal, members }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setOpenMembersModal(false)}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
          <span className="dark:text-white">
            All Members ({members?.length || 0})
          </span>
        </ModalHeader>
        <ModalBody className="p-0">
          <ScrollShadow className="max-h-[60vh]">
            <div className="p-4 space-y-2">
              {members?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
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
          <Button
            color="success"
            variant="flat"
            onPress={() => setOpenMembersModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default MemberModal;
