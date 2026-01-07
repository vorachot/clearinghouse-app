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
import { OrganizationQuota } from "@/types/quota";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

type OrganizationQuotaListProps = {
  quotas: OrganizationQuota[];
  onCreateClick: () => void;
  onViewDetails: (quota: OrganizationQuota) => void;
};

export default function OrganizationQuotaList({
  quotas,
  onCreateClick,
  onViewDetails,
}: OrganizationQuotaListProps) {
  const formatDuration = (seconds: number) => {
    if (seconds < 3600) {
      return `${seconds / 60} min`;
    }
    return `${seconds / 3600} hr`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organization Quotas</h2>
        <Button
          color="primary"
          startContent={<AddIcon />}
          onPress={onCreateClick}
        >
          Create Quota
        </Button>
      </div>

      <Card>
        <CardBody className="p-0">
          <Table aria-label="Organization quotas table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>FROM → TO</TableColumn>
              <TableColumn>RESOURCE TYPE</TableColumn>
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
                              resource.resource_prop.max_duration
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        onPress={() => onViewDetails(quota)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
