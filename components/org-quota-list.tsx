"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { OrganizationQuota } from "@/types/quota";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOrgQuotaDialog from "./delete-org-quota-dialog";

type OrganizationQuotaListProps = {
  quotas: OrganizationQuota[];
  onCreateClick: () => void;
  onViewDetails: (quota: OrganizationQuota) => void;
  onDelete?: (quotaId: string) => void;
  hideCreateButton?: boolean;
};

export default function OrganizationQuotaList({
  quotas,
  onCreateClick,
  onViewDetails,
  onDelete,
  hideCreateButton = false,
}: OrganizationQuotaListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuotaId, setSelectedQuotaId] = useState<string>("");
  const [selectedQuotaName, setSelectedQuotaName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  const formatDuration = (seconds: number) => {
    if (seconds < 3600) {
      return `${seconds / 60} min`;
    }
    return `${seconds / 3600} hr`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {!hideCreateButton ? (
          <>
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Quotas Allocated by This Organization
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resources allocated to other organizations
              </p>
            </div>
            <Button
              color="primary"
              startContent={<AddIcon />}
              onPress={onCreateClick}
            >
              Create Quota
            </Button>
          </>
        ) : (
          <>
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Quotas Received by This Organization
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resources received from other organizations
              </p>
            </div>
          </>
        )}
      </div>

      <Card>
        <CardBody className="p-0">
          <Table aria-label="Organization quotas table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>FROM → TO</TableColumn>
              <TableColumn>RESOURCE TYPE</TableColumn>
              <TableColumn>RESOURCE NAME</TableColumn>
              <TableColumn>QUANTITY</TableColumn>
              <TableColumn>DURATION</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No quotas found">
              {quotas.map((quota) => {
                return (
                  <TableRow key={quota.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{quota.name}</p>
                        {/* <p className="text-xs text-gray-500">
                          {quota.description}
                        </p> */}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">
                          {quota.from_organization?.name ||
                            quota.from_organization_id}
                          →
                          {quota.to_organization?.name ||
                            quota.to_organization_id}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {quota.resources.map((resource) => (
                          <div key={resource.id} className="text-sm">
                            {resource.resource_prop.resource.resource_type
                              .name ||
                              resource.resource_prop.resource.resource_type.id}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {quota.resources.map((resource) => (
                          <div key={resource.id} className="text-sm">
                            {resource.resource_prop.resource.name ||
                              resource.resource_prop.resource.id}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {quota.resources.map((resource) => (
                          <div key={resource.id} className="text-sm">
                            {resource.quantity}{" "}
                            {resource.resource_prop.resource.resource_type.unit}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {quota.resources.map((resource) => (
                          <div key={resource.id} className="text-sm">
                            {formatDuration(
                              resource.resource_prop.max_duration,
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* <Tooltip content="View details">
                          <Button
                            size="sm"
                            variant="light"
                            isIconOnly
                            color="primary"
                            onPress={() => onViewDetails(quota)}
                          >
                            <VisibilityIcon className="!w-4 !h-4" />
                          </Button>
                        </Tooltip> */}
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
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <DeleteOrgQuotaDialog
        isOpen={deleteDialogOpen}
        quotaName={selectedQuotaName}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={error}
      />
    </div>
  );
}
