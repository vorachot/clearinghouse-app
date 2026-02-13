import { User } from "@/context/UserContext";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import {
  GroupRounded,
  PersonAddRounded,
  AdminPanelSettingsRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";

type Props = {
  members?: User[];
  admins?: User[];
  currentUser?: User | null;
  handleOpenAddMember: () => void;
  handleOpenAddAdmin: () => void;
  setOpenMembersModal: (open: boolean) => void;
};

const MemberCard = ({
  members,
  admins,
  currentUser,
  handleOpenAddMember,
  handleOpenAddAdmin,
  setOpenMembersModal,
}: Props) => {
  const adminCount = admins?.length || 0;
  const memberCount = members?.length || 0;
  const isAdmin =
    currentUser && admins?.some((admin) => admin.id === currentUser.id);

  return (
    <Card
      isHoverable
      className="cursor-pointer transition-all hover:scale-[1.02] "
    >
      <CardBody className="p-6">
        <div
          className="flex items-start justify-between"
          onClick={() => setOpenMembersModal(true)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg flex-shrink-0">
                <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white break-words">
                Members/Admins
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-3 line-clamp-2">
              Manage team members and administrators
            </p>
            <div className="space-y-1.5">
              {/* <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {totalMembers} total member{totalMembers !== 1 ? "s" : ""}
                </span>
              </div> */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 break-words">
                  {memberCount} member{memberCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 break-words">
                  {adminCount} admin{adminCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-2 mt-4 flex-wrap">
                <Button
                  size="sm"
                  color="success"
                  variant="flat"
                  startContent={<PersonAddRounded className="!w-4 !h-4" />}
                  onPress={handleOpenAddMember}
                  className="flex-shrink-0"
                >
                  Member
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={
                    <AdminPanelSettingsRounded className="!w-4 !h-4" />
                  }
                  onPress={handleOpenAddAdmin}
                  className="flex-shrink-0"
                >
                  Admin
                </Button>
              </div>
            )}
          </div>
          <ArrowForwardRounded className="!w-5 !h-5 text-gray-400 ml-2 mt-1" />
        </div>
      </CardBody>
    </Card>
  );
};
export default MemberCard;
