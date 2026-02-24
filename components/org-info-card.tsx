import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import {
  StorageRounded as RamIcon,
  MemoryRounded as CpuIcon,
  GraphicEqRounded as GpuIcon,
  CorporateFareRounded,
  EditRounded,
  DeleteRounded,
  VisibilityRounded,
  AdminPanelSettingsRounded,
  PersonRounded,
  StarRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useUser, User } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { getResourcePoolsByOrgId } from "@/api/resource";

type ResourceQuota = {
  type_id: string;
  type: string;
  quota: number;
};

type AggregatedResource = {
  type_name: string;
  total_quantity: number;
  unit: string;
};

type Props = {
  id?: string;
  name?: string;
  domain?: string;
  admins?: User[];
  members?: User[];
  resource_quotas?: ResourceQuota[];
  created_at?: string;
  updated_at?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const OrgInfoCard = ({
  id,
  name,
  domain,
  admins = [],
  members = [],
  onEdit,
  onDelete,
}: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const [aggregatedResources, setAggregatedResources] = useState<
    AggregatedResource[]
  >([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);

  useEffect(() => {
    const fetchAndAggregateResources = async () => {
      if (!id) return;

      setIsLoadingResources(true);
      try {
        const resourcePools = await getResourcePoolsByOrgId(id);

        // Aggregate resources by resource type name
        const aggregated: { [key: string]: { total: number; unit: string } } =
          {};

        resourcePools.forEach((pool: any) => {
          pool.nodes?.forEach((node: any) => {
            node.resources?.forEach((resource: any) => {
              const typeName = resource.resource_type.name;
              const unit = resource.resource_type.unit;

              if (!aggregated[typeName]) {
                aggregated[typeName] = { total: 0, unit };
              }
              aggregated[typeName].total += resource.quantity;
            });
          });
        });

        // Convert to array
        const aggregatedArray = Object.entries(aggregated).map(
          ([type_name, data]) => ({
            type_name,
            total_quantity: data.total,
            unit: data.unit,
          }),
        );

        setAggregatedResources(aggregatedArray);
      } catch (error) {
        console.error("Error fetching resource pools:", error);
        setAggregatedResources([]);
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchAndAggregateResources();
  }, [id]);

  const isSuperAdmin = user?.is_super_admin || false;
  const isAdmin = user && admins.some((admin) => admin.id === user.id);
  const isMember = user && members.some((member) => member.id === user.id);
  const canViewDetails = user && (isAdmin || isMember);

  // Determine user roles for display (can have multiple)
  const getUserRoles = () => {
    const roles = [];

    if (isSuperAdmin) {
      roles.push({
        label: "Super Admin",
        color: "warning" as const,
        icon: StarRounded,
        variant: "flat" as const,
      });
      return roles; // Super admin only shows this badge
    }

    if (isAdmin) {
      roles.push({
        label: "Admin",
        color: "primary" as const,
        icon: AdminPanelSettingsRounded,
        variant: "flat" as const,
      });
    }

    if (isMember) {
      roles.push({
        label: "Member",
        color: "success" as const,
        icon: PersonRounded,
        variant: "flat" as const,
      });
    }

    return roles.length > 0 ? roles : null;
  };

  const userRoles = getUserRoles();

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

  // Helper function to get icon and styling based on resource type
  const getResourceStyle = (type: string) => {
    const typeUpper = type.toUpperCase();
    switch (typeUpper) {
      case "CPU":
        return {
          icon: CpuIcon,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          iconColor: "text-blue-600 dark:text-blue-400",
          valueColor: "text-blue-600 dark:text-blue-400",
        };
      case "GPU":
        return {
          icon: GpuIcon,
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          iconColor: "text-purple-600 dark:text-purple-400",
          valueColor: "text-purple-600 dark:text-purple-400",
        };
      case "RAM":
        return {
          icon: RamIcon,
          bgColor: "bg-green-50 dark:bg-green-900/20",
          iconColor: "text-green-600 dark:text-green-400",
          valueColor: "text-green-600 dark:text-green-400",
        };
      default:
        return {
          icon: RamIcon,
          bgColor: "bg-gray-50 dark:bg-gray-900/20",
          iconColor: "text-gray-600 dark:text-gray-400",
          valueColor: "text-gray-600 dark:text-gray-400",
        };
    }
  };

  return (
    <Card
      aria-label={`Organization card for ${name}`}
      className="group w-[250px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out 
      hover:shadow-2xl hover:scale-[1.03]"
      role="article"
    >
      <CardHeader className="flex flex-col gap-2 pb-2">
        <div className="flex items-start justify-between w-full">
          <div className="flex gap-3 items-center flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <CorporateFareRounded className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <Tooltip content={name} className="dark:text-white">
                <p
                  className="text-lg font-bold truncate text-gray-900 dark:text-white"
                  title={name}
                >
                  {name}
                </p>
              </Tooltip>
              {domain && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {domain}
                </p>
              )}
            </div>
          </div>
          {isSuperAdmin && (
            <div
              className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip
                content="Edit"
                placement="top"
                className="dark:text-white"
              >
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
          )}
        </div>
        {userRoles && userRoles.length > 0 && (
          <div className="flex flex-wrap w-full items-start gap-1 px-1">
            {userRoles.map((role, index) => (
              <Chip
                key={index}
                size="sm"
                color={role.color}
                variant={role.variant}
                startContent={<role.icon className="!w-3.5 !h-3.5 ml-1" />}
                className="h-5 text-xs flex items-center gap-0.5 px-1 justify-center"
              >
                {role.label}
              </Chip>
            ))}
          </div>
        )}
      </CardHeader>
      <Divider className="bg-gray-200 dark:bg-gray-700" />
      <CardBody className="pt-4 pb-4">
        {isLoadingResources ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              Loading resources...
            </span>
          </div>
        ) : aggregatedResources.length === 0 ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-gray-400 dark:text-gray-500">
              No resources found
            </span>
          </div>
        ) : (
          <div className="space-y-3">
            {aggregatedResources.map((resource, index) => {
              const style = getResourceStyle(resource.type_name);
              const Icon = style.icon;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded-lg ${style.bgColor} transition-colors`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`!w-5 !h-5 ${style.iconColor}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {resource.type_name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-bold ${style.valueColor}`}>
                      {resource.total_quantity}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {resource.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
      <Divider className="bg-gray-200 dark:bg-gray-700" />
      <CardFooter className="pt-3 pb-3">
        {isSuperAdmin ? null : canViewDetails ? (
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
        ) : (
          <Button fullWidth size="sm" color="default" variant="flat" isDisabled>
            Access Restricted
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
export default OrgInfoCard;
