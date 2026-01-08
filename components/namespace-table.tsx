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
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Namespace } from "@/types/namespace";

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

  const handleView = (namespaceId: string) => {
    router.push(
      `/organizations/${organizationId}/${projectId}/${namespaceId}`// ยังไม่สร้างหน้านี้
    );
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
                    {namespace.quota_template || "None"}
                  </span>
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
                  <span className="font-medium">
                    {namespace.credit || 0} credits
                  </span>
                </Chip>
              </TableCell>
              <TableCell>
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
                  <Tooltip content="Edit namespace" className="dark:text-white">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NamespaceTable;
