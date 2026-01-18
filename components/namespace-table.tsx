"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import {
  FolderOpenRounded,
  EditRounded,
  DeleteRounded,
  VisibilityRounded,
  PeopleAltRounded,
  StyleRounded,
  TollRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Namespace } from "@/types/namespace";
import { useUser } from "@/context/UserContext";
import { useState, useEffect } from "react";
import { getQuotaUsageByNamespaceId } from "@/api/quota";
import UsageBar from "./usagebar";

type Props = {
  organizationId: string;
  projectId: string;
  namespaces: Namespace[];
  onDelete?: (namespaceId: string) => void;
};

const NamespaceTable = ({
  organizationId,
  projectId,
  namespaces,
  onDelete,
}: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const [namespaceUsages, setNamespaceUsages] = useState<
    Record<string, Record<string, any>>
  >({});

  useEffect(() => {
    const fetchAllUsages = async () => {
      const allUsages: Record<string, Record<string, any>> = {};

      for (const namespace of namespaces) {
        if (namespace.quota_template?.quotas) {
          const quotaUsages: Record<string, any> = {};

          for (const quota of namespace.quota_template.quotas) {
            try {
              const usage = await getQuotaUsageByNamespaceId(
                quota.id,
                namespace.id
              );
              quotaUsages[quota.id] = usage;
            } catch (error) {
              console.error(
                `Error fetching usage for quota ${quota.id}:`,
                error
              );
            }
          }

          allUsages[namespace.id] = quotaUsages;
        }
      }

      setNamespaceUsages(allUsages);
    };

    if (namespaces.length > 0) {
      fetchAllUsages();
    }
  }, [namespaces]);

  const handleView = (namespaceId: string) => {
    router.push(`/organizations/${organizationId}/${projectId}/${namespaceId}`);
  };

  const handleEdit = (namespaceId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit namespace:", namespaceId);
  };

  const handleDelete = (namespaceId: string) => {
    if (onDelete) {
      onDelete(namespaceId);
    }
  };

  const columns = [
    { key: "name", label: "NAMESPACE NAME" },
    { key: "description", label: "DESCRIPTION" },
    { key: "template", label: "QUOTA TEMPLATE" },
    { key: "usage", label: "USAGE" },
    { key: "members", label: "MEMBERS" },
    { key: "credit", label: "CREDIT" },
    { key: "actions", label: "ACTIONS" },
  ];

  return (
    <div className="w-full">
      <Table
        aria-label="Namespaces table"
        className="min-w-full"
        classNames={{
          wrapper: "shadow-md rounded-lg",
          th: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold",
          td: "py-4",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} className="uppercase text-xs">
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {namespaces.map((namespace) => (
            <TableRow
              key={namespace.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <FolderOpenRounded className="!w-5 !h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {namespace.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {namespace.description || "No description"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <StyleRounded className="!w-4 !h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {namespace.quota_template?.name || "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 flex-wrap">
                  {namespace.quota_template?.quotas?.map((q) =>
                    q.resources?.map((r) => {
                      const quotaUsages = namespaceUsages[namespace.id];
                      const usage = quotaUsages?.[q.id];
                      const resourceTypeId =
                        r.resource_prop?.resource?.resource_type_id;
                      const matchingUsage = usage?.type?.find(
                        (usageType: any) => usageType.type_id === resourceTypeId
                      );
                      const usedAmount = matchingUsage?.used || 0;
                      const totalAmount = r.quantity || 0;

                      return (
                        // <Chip key={r.id} size="sm" variant="flat">
                        //   {r.resource_prop?.resource?.resource_type?.name ||
                        //     "Unknown"}
                        //   : {usedAmount}/{totalAmount}
                        // </Chip>
                        <UsageBar
                          value={usedAmount}
                          maxValue={totalAmount}
                          label={
                            r.resource_prop?.resource?.resource_type?.name ||
                            "Unknown"
                          }
                        />
                      );
                    })
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" color="success" variant="flat" className="px-2">
                  <PeopleAltRounded className="!w-4 !h-4 mr-1" />
                  <span className="font-medium dark:text-green-400">
                    {namespace.namespace_members?.length || 0}
                  </span>
                </Chip>
              </TableCell>
              <TableCell>
                <Chip size="sm" color="primary" variant="flat" className="px-2">
                  <TollRounded className="!w-4 !h-4 mr-1" />
                  <span className="font-medium">
                    {namespace.credit || 0} credits
                  </span>
                </Chip>
              </TableCell>
              <TableCell>
                {user && namespace.owner_id === user.id ? (
                  <div className="flex items-center gap-2">
                    <Tooltip content="View details" className="dark:text-white">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="View namespace"
                        onPress={() => handleView(namespace.id)}
                      >
                        <VisibilityRounded className="!w-4 !h-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Edit namespace"
                      className="dark:text-white"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="warning"
                        aria-label="Edit namespace"
                        onPress={() => handleEdit(namespace.id)}
                      >
                        <EditRounded className="!w-4 !h-4" />
                      </Button>
                    </Tooltip>
                    <Tooltip
                      content="Delete namespace"
                      className="dark:text-white"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="Delete namespace"
                        onPress={() => handleDelete(namespace.id)}
                      >
                        <DeleteRounded className="!w-4 !h-4" />
                      </Button>
                    </Tooltip>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No actions available
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NamespaceTable;
