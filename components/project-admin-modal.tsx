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
  AdminPanelSettingsRounded,
  PersonRounded,
  PersonRemoveRounded,
} from "@mui/icons-material";
import { useState } from "react";
import { removeAdminFromProject } from "@/api/member";
import { mutate } from "swr";
import useSWR from "swr";
import { getProjectById } from "@/api/project";
import Loading from "@/app/loading";

type Props = {
  isOpen: boolean;
  setOpenModal: (open: boolean) => void;
  admins?: User[];
  projectId?: string;
  orgId?: string;
  orgAdmins?: User[];
  onAddAdmin?: () => void;
};

const ProjectAdminModal = ({
  isOpen,
  setOpenModal,
  admins,
  projectId,
  orgId,
  orgAdmins = [],
  onAddAdmin,
}: Props) => {
  const { user: currentUser } = useUser();
  const [selectedAdmins, setSelectedAdmins] = useState<Set<string>>(
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

  const currentAdmins = projectData?.admins || admins || [];

  const adminIds = new Set(currentAdmins.map((a: User) => a.id));
  const orgAdminIds = new Set(orgAdmins.map((a) => a.id));
  const isCurrentUserAdmin = currentUser && adminIds.has(currentUser.id);
  const isCurrentUserOrgAdmin = currentUser && orgAdminIds.has(currentUser.id);
  const canManage = isCurrentUserAdmin || isCurrentUserOrgAdmin;
  const sortedAdmins = currentAdmins;

  const handleToggleAdmin = (adminId: string) => {
    const newSelected = new Set(selectedAdmins);
    if (newSelected.has(adminId)) {
      newSelected.delete(adminId);
    } else {
      newSelected.add(adminId);
    }
    setSelectedAdmins(newSelected);
  };

  const handleRemoveAdmins = async () => {
    if (selectedAdmins.size === 0 || !projectId) return;

    setIsRemoving(true);
    try {
      await removeAdminFromProject({
        project_id: projectId,
        admins: Array.from(selectedAdmins),
      });
      setSelectedAdmins(new Set([]));
      await mutate(["project", projectId]);
      if (orgId) await mutate(["orgs", orgId, "projects"]);
      setOpenModal(false);
    } catch (error) {
      console.error("Error removing admins:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setSelectedAdmins(new Set([]));
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
              <AdminPanelSettingsRounded className="!w-6 !h-6 text-primary-600 dark:text-primary-400" />
              <span className="dark:text-white">
                Project Admins ({sortedAdmins.length})
              </span>
              {selectedAdmins.size > 0 && (
                <Chip size="sm" color="primary" variant="flat">
                  {selectedAdmins.size} selected
                </Chip>
              )}
            </ModalHeader>
            <ModalBody className="p-0">
              <ScrollShadow className="max-h-[60vh]">
                <div className="p-4 space-y-2">
                  {sortedAdmins.length > 0 ? (
                    sortedAdmins.map((admin: User) => (
                      <div
                        key={admin.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          canManage
                            ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            : ""
                        }`}
                        onClick={
                          canManage
                            ? () => handleToggleAdmin(admin.id)
                            : undefined
                        }
                      >
                        {canManage && (
                          <Checkbox
                            isSelected={selectedAdmins.has(admin.id)}
                            onValueChange={() => handleToggleAdmin(admin.id)}
                          />
                        )}
                        <PersonRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {admin.first_name} {admin.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {admin.email}
                          </p>
                        </div>
                        <Chip size="sm" color="primary" variant="flat">
                          Admin
                        </Chip>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <AdminPanelSettingsRounded className="!w-12 !h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">
                        No admins in this project
                      </p>
                    </div>
                  )}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              {canManage && onAddAdmin && (
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<AdminPanelSettingsRounded />}
                  onPress={() => {
                    onAddAdmin();
                    setOpenModal(false);
                  }}
                >
                  Add Admin
                </Button>
              )}
              {canManage && selectedAdmins.size > 0 && (
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<PersonRemoveRounded />}
                  onPress={handleRemoveAdmins}
                  isLoading={isRemoving}
                  isDisabled={
                    (currentUser && selectedAdmins.has(currentUser.id)) || false
                  }
                >
                  {currentUser && selectedAdmins.has(currentUser.id)
                    ? "Cannot Remove Yourself"
                    : `Remove ${selectedAdmins.size} Admin${selectedAdmins.size !== 1 ? "s" : ""}`}
                </Button>
              )}
              <Button
                color="success"
                variant="flat"
                onPress={() => {
                  setSelectedAdmins(new Set([]));
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
export default ProjectAdminModal;
