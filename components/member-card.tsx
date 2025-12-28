import { User } from "@/context/UserContext";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";

import {
  GroupRounded,
  PersonAddRounded,
  PersonRounded,
} from "@mui/icons-material";

type Props = {
  members?: User[];
  handleOpenAddMember: () => void;
  setOpenMembersModal: (open: boolean) => void;
}

const MemberCard = ({ members, handleOpenAddMember, setOpenMembersModal }: Props) => {
  const INITIAL_DISPLAY_COUNT = 1;
  const displayedMembers = members?.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreMembers = (members?.length || 0) > INITIAL_DISPLAY_COUNT;
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="flex gap-3 pb-2 justify-between">
        <div className="flex gap-3">
          <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Members</p>
            <p className="text-small text-gray-500 dark:text-gray-400">
              {members?.length || 0} member
              {members?.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          color="success"
          variant="flat"
          startContent={<PersonAddRounded />}
          onPress={handleOpenAddMember}
        >
          Member
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="gap-2">
        {displayedMembers && displayedMembers.length > 0 ? (
          <>
            {displayedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
            {hasMoreMembers && (
              <Button
                size="sm"
                variant="flat"
                color="success"
                className="w-full mt-2"
                onPress={() => setOpenMembersModal(true)}
              >
                View All {members?.length || 0} Members
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No members assigned
          </p>
        )}
      </CardBody>
    </Card>
  );
};
export default MemberCard;
