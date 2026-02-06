"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { ProjectQuota } from "@/types/quota";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import useSWR from "swr";
import { getResourceNodeById } from "@/api/resource";
import { getOrgQuotasByOrgId } from "@/api/quota";
import DeleteProjectQuotaDialog from "./delete-project-quota-dialog";
import { BusinessRounded } from "@mui/icons-material";

type ProjectQuotaListProps = {
  quotas: ProjectQuota[];
  onCreateClick?: () => void;
  onDelete?: (quotaId: string) => void;
  type?: "external" | "internal";
};

function NodeName({ nodeId }: { nodeId: string | null }) {
  const { data, isLoading } = useSWR(
    nodeId ? ["node", nodeId] : null,
    () => (nodeId ? getResourceNodeById(nodeId) : null),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  if (!nodeId) return <span className="text-xs text-gray-400">-</span>;
  if (isLoading)
    return <span className="text-xs text-gray-500">Loading...</span>;

  return (
    <div>
      <p className="text-sm">{data?.name || nodeId}</p>
    </div>
  );
}

function OrgQuotaName({
  orgQuotaId,
  orgId,
}: {
  orgQuotaId: string | null;
  orgId?: string;
}) {
  const { data, isLoading } = useSWR(
    orgId && orgQuotaId ? ["org-quotas", orgId] : null,
    () => (orgId ? getOrgQuotasByOrgId(orgId) : null),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  if (!orgQuotaId) return null;
  if (isLoading)
    return <span className="text-xs text-gray-500">Loading...</span>;

  const quota = data?.find((q: any) => q.id === orgQuotaId);

  return (
    <p className="text-xs text-gray-500 mt-1">{quota?.name || orgQuotaId}</p>
  );
}

export default function ProjectQuotaList({
  quotas,
  onCreateClick,
  onDelete,
  type = "external",
}: ProjectQuotaListProps) {
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
        console.error("Error deleting project quota:", error);
        setError(
          error.response?.data?.error || "Failed to delete project quota",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };
  const getSourceLabel = (quota: ProjectQuota) => {
    return quota.organization_quota_id ? "Org Quota" : "Resource Pool";
  };

  // const calculateTotalPrice = (quota: ProjectQuota) => {
  //   return quota.resources.reduce((total, resource) => {
  //     return total + (resource.resource_prop?.price || 0) * resource.quantity;
  //   }, 0);
  // };

  return (
    <div className="space-y-4">
      <Table aria-label="Project quotas table">
        <TableHeader>
          <TableColumn>QUOTA NAME</TableColumn>
          <TableColumn>NODE</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>SOURCE</TableColumn>
          <TableColumn>RESOURCES</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
          {/* <TableColumn>TOTAL PRICE</TableColumn> */}
        </TableHeader>
        <TableBody emptyContent="No quotas found">
          {quotas.map((quota) => (
            <TableRow key={quota.id}>
              <TableCell>
                <div>
                  <p className="font-semibold">{quota.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color="secondary">
                  <NodeName nodeId={quota.node_id} />
                </Chip>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">{quota.description}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Chip size="sm" variant="flat" color="success">
                    <div className="flex items-center gap-1">
                      {/* <BusinessRounded className="!w-4 !h-4 text-success" /> */}
                      {getSourceLabel(quota)}
                    </div>
                  </Chip>
                  {/* {quota.organization_quota_id && (
                    <OrgQuotaName
                      orgQuotaId={quota.organization_quota_id}
                      orgId={quota.organization_id}
                    />
                  )} */}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {quota.resources.slice(0, 3).map((resource) => (
                    <Chip
                      key={resource.id}
                      size="sm"
                      variant="flat"
                      color="primary"
                    >
                      {resource.resource_prop.resource.resource_type.name ||
                        "Unknown"}
                      : {resource.quantity} {resource.resource_prop.resource.resource_type.unit}
                    </Chip>
                  ))}
                  {quota.resources.length > 3 && (
                    <Chip size="sm" variant="flat" color="primary">
                      +{quota.resources.length - 3} more
                    </Chip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {onDelete && (
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
              {/* <TableCell>
                <span className="font-semibold">
                  ${calculateTotalPrice(quota).toFixed(2)}
                </span>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteProjectQuotaDialog
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
