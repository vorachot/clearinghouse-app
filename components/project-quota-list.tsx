"use client";

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
import { ProjectQuota } from "@/types/quota";
import AddIcon from "@mui/icons-material/Add";

type ProjectQuotaListProps = {
  quotas: ProjectQuota[];
  onCreateClick: () => void;
  type?: "external" | "internal";
};

export default function ProjectQuotaList({
  quotas,
  onCreateClick,
  type = "external",
}: ProjectQuotaListProps) {
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {type === "external"
            ? "External Project Quotas"
            : "Internal Project Quotas"}
        </h3>
        <Button
          color="primary"
          startContent={<AddIcon />}
          onPress={onCreateClick}
          size="sm"
        >
          Create {type === "external" ? "External" : "Internal"} Quota
        </Button>
      </div>

      <Table aria-label="Project quotas table">
        <TableHeader>
          <TableColumn>QUOTA NAME</TableColumn>
          {/* <TableColumn>NODE ID</TableColumn> */}
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>SOURCE</TableColumn>
          <TableColumn>RESOURCES</TableColumn>
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
                <div>
                  <p className="font-semibold">{quota.description}</p>
                </div>
              </TableCell>
              {/* <TableCell>
                <div>
                  <p className="text-xs text-gray-500">{quota.node_id}</p>
                </div>
              </TableCell> */}
              <TableCell>
                <div>
                  <Chip size="sm" variant="flat" color="secondary">
                    {getSourceLabel(quota)}
                  </Chip>
                  {/* {quota.organization_quota_id && (
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {quota.organization_quota_id}
                    </p>
                  )} */}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {quota.resources.slice(0, 3).map((resource) => (
                    <Chip key={resource.id} size="sm" variant="flat">
                      {resource.resource_prop?.resource?.name || "Unknown"}:{" "}
                      {resource.quantity}
                    </Chip>
                  ))}
                  {quota.resources.length > 3 && (
                    <Chip size="sm" variant="flat">
                      +{quota.resources.length - 3} more
                    </Chip>
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
    </div>
  );
}
