"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { OrganizationQuota, UpdateOrganizationQuotaDTO } from "@/types/quota";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOrgQuotaDialog from "./delete-org-quota-dialog";
import EditOrgQuotaDialog from "./edit-org-quota-dialog";

type OrganizationQuotaListProps = {
  quotas: OrganizationQuota[];
  onCreateClick: () => void;
  onViewDetails: (quota: OrganizationQuota) => void;
  onDelete?: (quotaId: string) => void;
  onEdit?: (quotaId: string, data: UpdateOrganizationQuotaDTO) => void;
  hideCreateButton?: boolean;
};

const resourceTypeColors: Record<
  string,
  "primary" | "secondary" | "success" | "warning" | "danger" | "default"
> = {
  GPU: "secondary",
  CPU: "primary",
  RAM: "success",
};

function getResourceColor(
  typeName: string,
): "primary" | "secondary" | "success" | "warning" | "danger" | "default" {
  return resourceTypeColors[typeName?.toUpperCase()] || "default";
}

export default function OrganizationQuotaList({
  quotas,
  onCreateClick,
  onViewDetails,
  onDelete,
  onEdit,
  hideCreateButton = false,
}: OrganizationQuotaListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuotaId, setSelectedQuotaId] = useState<string>("");
  const [selectedQuotaName, setSelectedQuotaName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<OrganizationQuota | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleDelete = (quotaId: string, quotaName: string) => {
    setSelectedQuotaId(quotaId);
    setSelectedQuotaName(quotaName);
    setDeleteDialogOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (onDelete && selectedQuotaId) {
      setIsDeleting(true);
      try {
        await onDelete(selectedQuotaId);
        setDeleteDialogOpen(false);
      } catch (error: any) {
        console.error("Error deleting organization quota:", error);
        setError(
          error.response?.data?.error || "Failed to delete organization quota",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = (quota: OrganizationQuota) => {
    setSelectedQuota(quota);
    setEditDialogOpen(true);
    setEditError(null);
  };

  const handleConfirmEdit = async (
    quotaId: string,
    data: UpdateOrganizationQuotaDTO,
  ) => {
    if (!onEdit) return;

    setIsUpdating(true);
    try {
      await onEdit(quotaId, data);
      setEditDialogOpen(false);
      setSelectedQuota(null);
    } catch (error: any) {
      console.error("Error updating organization quota:", error);
      setEditError(
        error.response?.data?.error || "Failed to update organization quota",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 3600) return `${seconds / 60}m`;
    return `${seconds / 3600}h`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          {!hideCreateButton ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Allocated by This Organization
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Quotas shared with other organizations
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Received by This Organization
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Quotas received from other organizations
              </p>
            </>
          )}
        </div>
        {!hideCreateButton && (
          <Button
            color="primary"
            startContent={<AddIcon className="!w-4 !h-4" />}
            onPress={onCreateClick}
            size="sm"
          >
            Create Quota
          </Button>
        )}
      </div>

      {quotas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {hideCreateButton
              ? "No quotas have been received yet."
              : 'No quotas allocated yet. Click "Create Quota" to get started.'}
          </p>
        </div>
      ) : (
        <Table
          aria-label="Organization quotas table"
          classNames={{
            wrapper:
              "rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm",
            th: "bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider",
            td: "py-3",
          }}
        >
          <TableHeader>
            <TableColumn>QUOTA NAME</TableColumn>
            <TableColumn>DIRECTION</TableColumn>
            <TableColumn>RESOURCES</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {quotas.map((quota) => (
              <TableRow
                key={quota.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <TableCell>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {quota.name}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {quota.from_organization?.name ||
                        quota.from_organization_id}
                    </span>
                    <ArrowForwardIcon className="!w-4 !h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {quota.to_organization?.name || quota.to_organization_id}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {quota.resources.map((resource) => {
                      const typeName =
                        resource.resource_prop.resource.resource_type.name;
                      const unit =
                        resource.resource_prop.resource.resource_type.unit;
                      const duration = formatDuration(
                        resource.resource_prop.max_duration,
                      );
                      return (
                        <Chip
                          key={resource.id}
                          size="sm"
                          color={getResourceColor(typeName)}
                          variant="flat"
                          className="font-medium"
                        >
                          {typeName}: {resource.quantity} {unit} · {duration}
                        </Chip>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {!hideCreateButton && onEdit && (
                      <Tooltip content="Edit quota" color="warning">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          color="warning"
                          onPress={() => handleEdit(quota)}
                        >
                          <EditIcon className="!w-4 !h-4" />
                        </Button>
                      </Tooltip>
                    )}
                    {!hideCreateButton && onDelete && (
                      <Tooltip content="Delete quota" color="danger">
                        <Button
                          size="sm"
                          variant="light"
                          isIconOnly
                          color="danger"
                          onPress={() => handleDelete(quota.id, quota.name)}
                        >
                          <DeleteIcon className="!w-4 !h-4" />
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <DeleteOrgQuotaDialog
        isOpen={deleteDialogOpen}
        quotaName={selectedQuotaName}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={error}
      />
      <EditOrgQuotaDialog
        isOpen={editDialogOpen}
        quota={selectedQuota}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedQuota(null);
        }}
        onConfirm={handleConfirmEdit}
        isUpdating={isUpdating}
        error={editError}
      />
    </div>
  );
}
