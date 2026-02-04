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
  handleOpenAddMember: () => void;
  handleOpenAddAdmin: () => void;
  setOpenMembersModal: (open: boolean) => void;
};

const MemberCard = ({
  members,
  admins,
  handleOpenAddMember,
  handleOpenAddAdmin,
  setOpenMembersModal,
}: Props) => {
  const totalMembers = new Set([
    ...(admins?.map((a) => a.id) || []),
    ...(members?.map((m) => m.id) || []),
  ]).size;

  const adminCount = admins?.length || 0;
  const memberCount = members?.length || 0;

  return (
    <Card
      isHoverable
      className="cursor-pointer transition-all hover:scale-[1.02]"
    >
      <CardBody className="p-6">
        <div
          className="flex items-start justify-between"
          onClick={() => setOpenMembersModal(true)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Members
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-3">
              Manage team members and administrators
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {totalMembers} total member{totalMembers !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {adminCount} admin{adminCount !== 1 ? "s" : ""} ·{" "}
                  {memberCount} member{memberCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                color="success"
                variant="flat"
                startContent={<PersonAddRounded className="!w-4 !h-4" />}
                onPress={handleOpenAddMember}
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
              >
                Admin
              </Button>
            </div>
          </div>
          <ArrowForwardRounded className="!w-5 !h-5 text-gray-400 ml-2 mt-1" />
        </div>
      </CardBody>
    </Card>
  );
};
export default MemberCard;
