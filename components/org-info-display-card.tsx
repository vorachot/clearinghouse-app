import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {
  BusinessRounded,
  DescriptionRounded,
  CalendarTodayRounded,
  UpdateRounded,
} from "@mui/icons-material";

type Props = {
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

const OrgInfoDisplayCard = ({
  name,
  description,
  created_at,
  updated_at,
}: Props) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md">
      <CardHeader className="flex gap-3 pb-2">
        <BusinessRounded className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
        <div className="flex flex-col">
          <p className="text-lg font-semibold">Organization Details</p>
          <p className="text-small text-gray-500 dark:text-gray-400">{name}</p>
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(created_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <UpdateRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Updated
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(updated_at)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default OrgInfoDisplayCard;
