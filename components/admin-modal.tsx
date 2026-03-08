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
  PersonRemoveRounded,
  PersonAddRounded,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import {
  addAdminToOrganization,
  removeAdminFromOrganization,
  getMembers,
} from "@/api/member";
import { mutate } from "swr";
import useSWR from "swr";
import { Select, SelectItem } from "@heroui/select";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  admins?: User[];
  orgId?: string;
};

const AdminModal = ({ isOpen, onClose, admins, orgId }: Props) => {
  const { user: currentUser } = useUser();
  const [selectedAdmins, setSelectedAdmins] = useState<Set<string>>(
    new Set([]),
  );
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedNewAdmins, setSelectedNewAdmins] = useState<Set<string>>(
    new Set([]),
  );

  const { data: allMembers, isLoading } = useSWR<User[]>(
    "members",
    getMembers,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  // Reset selected states when orgId or admins change
  useEffect(() => {
    setSelectedAdmins(new Set([]));
    setSelectedNewAdmins(new Set([]));
  }, [orgId, admins]);

  const adminIds = new Set(admins?.map((a) => a.id) || []);

  // Filter out users who are already admins and super admin (super admin shouldn't add themselves)
  const availableUsers =
    allMembers?.filter(
      (member) => !adminIds.has(member.id),
      // &&  !(currentUser?.is_super_admin && member.id === currentUser?.id),
    ) || [];

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
    if (selectedAdmins.size === 0 || !orgId) return;

    setIsRemoving(true);
    try {
      await removeAdminFromOrganization({
        organization_id: orgId,
        admins: Array.from(selectedAdmins),
      });
      setSelectedAdmins(new Set([]));
      await mutate(["orgs", orgId]);
      await mutate(["orgs"]);
      onClose();
    } catch (error) {
      console.error("Error removing admins:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleAddAdmins = async () => {
    if (selectedNewAdmins.size === 0 || !orgId) return;

    setIsAdding(true);
    try {
      await addAdminToOrganization({
        organization_id: orgId,
        admins: Array.from(selectedNewAdmins),
      });
      setSelectedNewAdmins(new Set([]));
      await mutate(["orgs", orgId]);
      await mutate(["orgs"]);
      onClose();
    } catch (error) {
      console.error("Error adding admins:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedAdmins(new Set([]));
    setSelectedNewAdmins(new Set([]));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <AdminPanelSettingsRounded className="!w-6 !h-6 text-primary-600 dark:text-primary-400" />
          <span className="dark:text-white">
            Manage Organization Admins ({admins?.length || 0})
          </span>
          {selectedAdmins.size > 0 && (
            <Chip size="sm" color="primary" variant="flat">
              {selectedAdmins.size} selected
            </Chip>
          )}
        </ModalHeader>
        <ModalBody className="p-4 space-y-6">
          {/* Add New Admins Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <PersonAddRounded className="!w-5 !h-5 text-primary-600 dark:text-primary-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Add New Admins
              </h4>
            </div>
            {isLoading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Loading available users...
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                No available users to add as admins
              </div>
            ) : (
              <>
                <Select
                  label="Select users to add as admins"
                  selectionMode="multiple"
                  placeholder="Choose users..."
                  selectedKeys={selectedNewAdmins}
                  onSelectionChange={(keys) =>
                    setSelectedNewAdmins(new Set(keys as Set<string>))
                  }
                  className="max-w-full"
                >
                  {availableUsers.map((user) => (
                    <SelectItem
                      key={user.id}
                      textValue={`${user.first_name} ${user.last_name} (${user.email})`}
                    >
                      <div className="flex flex-col dark:text-white">
                        <span className="font-medium">
                          {user.first_name} {user.last_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<PersonAddRounded />}
                  onPress={handleAddAdmins}
                  isLoading={isAdding}
                  isDisabled={selectedNewAdmins.size === 0}
                  className="w-full"
                >
                  Add Selected Users as Admins ({selectedNewAdmins.size})
                </Button>
              </>
            )}
          </div>

          {/* Current Admins Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AdminPanelSettingsRounded className="!w-5 !h-5 text-primary-600 dark:text-primary-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Current Admins
              </h4>
            </div>
            <ScrollShadow className="max-h-[40vh]">
              <div className="space-y-2">
                {admins && admins.length > 0 ? (
                  admins.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleToggleAdmin(admin.id)}
                    >
                      <Checkbox
                        isSelected={selectedAdmins.has(admin.id)}
                        onValueChange={() => handleToggleAdmin(admin.id)}
                      />
                      <AdminPanelSettingsRounded className="!w-5 !h-5 text-primary-600 dark:text-primary-400" />
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
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No admins found
                  </div>
                )}
              </div>
            </ScrollShadow>
          </div>
        </ModalBody>
        <ModalFooter>
          {selectedAdmins.size > 0 && (
            <Button
              color="danger"
              variant="flat"
              startContent={<PersonRemoveRounded />}
              onPress={handleRemoveAdmins}
              isLoading={isRemoving}
              isDisabled={
                (currentUser &&
                  selectedAdmins.has(currentUser.id) &&
                  !currentUser.is_super_admin) ||
                false
              }
            >
              {currentUser &&
              selectedAdmins.has(currentUser.id) &&
              !currentUser.is_super_admin
                ? "Cannot Remove Yourself from Admins"
                : `Remove from Admins (${selectedAdmins.size})`}
            </Button>
          )}
          <Button color="default" variant="flat" onPress={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminModal;
