import { Card, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import {
  StorageRounded as RamIcon,
  MemoryRounded as CpuIcon,
  GraphicEqRounded as GpuIcon,
  EditRounded as EditIcon,
} from "@mui/icons-material";

import { useState } from "react";
import EditQuotaDialog from "./edit-quota-dialog";

type Props = {
  organizationId: string;
  id: string;
  name: string;
};

const ProjectCard = ({ organizationId, id, name }: Props) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };
  return (
    <>
      <Link
        aria-label={`View project ${name} details`}
        className="no-underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
        href={`/organizations/${organizationId}/${id}`}
      >
        <Card
          aria-label={`Organization card for ${name}`}
          className="w-[300px] p-4 bg-white dark:bg-blue-900 shadow-md border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-300 ease-in-out 
      hover:shadow-xl hover:scale-[1.02]"
          role="article"
        >
          <CardHeader className="flex gap-3 py-0 mb-2 items-start">
            <p
              className="text-large font-semibold truncate flex-1"
              title={name}
            >
              {name}
            </p>
          </CardHeader>
          <Divider />
          <CardFooter className="flex flex-col gap-2">
            <div className="flex gap-2 justify-between items-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Quota Limits
              </p>
              <button
                // variant="ghost"
                className="border-0 p-0 min-h-0 min-w-0 h-6 w-6 hover:bg-gray-200 dark:hover:bg-blue-700 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                onClick={handleOpenEdit}
              >
                <EditIcon className="!text-[14px] text-gray-600 dark:text-white" />
              </button>
            </div>
            <div className="flex gap-10 justify-between mt-2">
              <div className="flex items-center gap-1">
                <CpuIcon className="!w-5 !h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  CPU
                </p>
              </div>
              <div className="flex items-center gap-1">
                <GpuIcon className="!w-5 !h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  GPU
                </p>
              </div>
              <div className="flex items-center gap-1">
                <RamIcon className="!w-5 !h-5 text-gray-500 dark:text-gray-400" />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  RAM
                </p>
              </div>
            </div>
            <div className="flex gap-12 justify-between mt-1 text-center text-gray-800 dark:text-gray-200">
              <div className="flex gap-1 items-center">
                <p className="text-large font-bold">16 </p>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  Core
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-large font-bold">32</p>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  GB
                </span>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-large font-bold">128</p>
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  GB
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
      {open && <EditQuotaDialog projectId={id} setOnClose={onClose} />}
    </>
  );
};
export default ProjectCard;
