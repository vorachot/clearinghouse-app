import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { BusinessRounded, CalendarTodayRounded, DescriptionRounded, FolderCopyRounded } from "@mui/icons-material";

type Props = {
  name: string;
  description?: string;
  projects_count: number;
}

const DetailCard = ({ name, description, projects_count }: Props) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="flex gap-3 pb-2">
        <BusinessRounded className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Organization Details</p>
          <p className="text-small text-gray-500 dark:text-gray-400">
            {name}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="gap-4">
        {description && (
          <div className="flex gap-3">
            <DescriptionRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
        )}
        <div className="flex gap-3">
          <CalendarTodayRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Created
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">N/A</p>
          </div>
        </div>
        <div className="flex gap-3">
          <FolderCopyRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Projects
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {projects_count || 0} project
              {projects_count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
export default DetailCard