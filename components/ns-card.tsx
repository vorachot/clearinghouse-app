import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { useState } from "react";
import UsageBar from "./usagebar";
import EditButton from "./edit-button";
import {
  ConfirmationNumberRounded,
  PeopleAltRounded,
} from "@mui/icons-material";
type Props = {
  organizationId: string;
  projectId: string;
  id: string;
  name: string;
};

const NsCard = ({ id, name }: Props) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenEditQuota = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };
  return (
    <Card
      aria-label={`Organization card for ${name}`}
      className="w-[230px] p-4 bg-white dark:bg-blue-900 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300
      hover:shadow-xl"
      role="article"
    >
      <CardHeader className="flex gap-3 py-0 mb-2 items-start">
        <p className="text-large font-semibold truncate flex-1" title={name}>
          {name}
        </p>
      </CardHeader>
      <Divider />
      <CardBody className="px-4">
        <div className="flex flex-col gap-1">
          <UsageBar label="CPU" value={40} maxValue={100} />
          <UsageBar label="GPU" value={20} maxValue={100} />
          <UsageBar label="Memory" value={60} maxValue={100} />
        </div>
      </CardBody>
      <CardFooter className="flex justify-center gap-4">
        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="flex gap-1">
            <PeopleAltRounded className="text-gray-600 dark:text-gray-300 !w-4 !h-4" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Member
            </p>
          </div>
          <div className="flex">
            <span className="text-md font-bold">5</span>
            <EditButton onClick={handleOpenEditQuota} />
          </div>
        </div>
        <Divider orientation="vertical" />
        <div className="flex flex-col gap-2 justify-between items-center">
          <div className="flex gap-1">
            <ConfirmationNumberRounded className="text-gray-600 dark:text-gray-300 !w-4 !h-4" />
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Quota
            </p>
          </div>
          <div className="flex">
            <span className="text-md font-bold">5</span>
            <EditButton onClick={handleOpenEditQuota} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
export default NsCard;
