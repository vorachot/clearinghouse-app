import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import {
  StorageRounded as RamIcon,
  MemoryRounded as CpuIcon,
  GraphicEqRounded as GpuIcon,
  CorporateFareRounded,
  EditRounded,
  DeleteRounded,
  VisibilityRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

type Props = {
  id?: string;
  name?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const OrgInfoCard = ({ id, name, onEdit, onDelete }: Props) => {
  const router = useRouter();

  const handleEdit = () => {
    if (id && onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id);
    }
  };

  const handleView = () => {
    if (id) {
      router.push(`/organizations/${id}`);
    }
  };

  return (
    <Card
      aria-label={`Organization card for ${name}`}
      className="group w-[250px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
      hover:shadow-2xl hover:scale-[1.03]"
      role="article"
    >
      <CardHeader className="flex flex-col gap-3 pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex gap-3 items-center flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CorporateFareRounded className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <Tooltip content={name} className="dark:text-white">
              <p
                className="text-lg font-bold truncate text-gray-900 dark:text-white"
                title={name}
              >
                {name}
              </p>
            </Tooltip>
          </div>
          <div
            className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip content="Edit" placement="top" className="dark:text-white">
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="primary"
                aria-label="Edit organization"
                onPress={handleEdit}
                className="min-w-unit-8 w-8 h-8"
              >
                <EditRounded className="!w-4 !h-4" />
              </Button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              className="dark:text-white"
            >
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="danger"
                aria-label="Delete organization"
                onPress={handleDelete}
                className="min-w-unit-8 w-8 h-8"
              >
                <DeleteRounded className="!w-4 !h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </CardHeader>
      <Divider className="bg-gray-200 dark:bg-gray-700" />
      <CardBody className="pt-4 pb-4">
        <div className="space-y-3">
          {/* CPU Resource */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 transition-colors">
            <div className="flex items-center gap-2">
              <CpuIcon className="!w-5 !h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                CPU
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                16
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Core
              </span>
            </div>
          </div>

          {/* GPU Resource */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 transition-colors">
            <div className="flex items-center gap-2">
              <GpuIcon className="!w-5 !h-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                GPU
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                32
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                GB
              </span>
            </div>
          </div>

          {/* RAM Resource */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20 transition-colors">
            <div className="flex items-center gap-2">
              <RamIcon className="!w-5 !h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                RAM
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                128
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                GB
              </span>
            </div>
          </div>
        </div>
      </CardBody>
      <Divider className="bg-gray-200 dark:bg-gray-700" />
      <CardFooter className="pt-3 pb-3">
        <Button
          fullWidth
          size="sm"
          color="primary"
          variant="flat"
          startContent={<VisibilityRounded className="!w-4 !h-4" />}
          onPress={handleView}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
export default OrgInfoCard;
