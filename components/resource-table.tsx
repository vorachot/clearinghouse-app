"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddResourceDialog from "./add-resource-dialog";
import type { ResourcePool } from "@/types/resource";

const resourceColumns = [
  { header: "POOL NAME", accessor: "name" },
  { header: "ORGANIZATION", accessor: "organization" },
  { header: "RESOURCES", accessor: "resources" },
  { header: "ACTIONS", accessor: "actions" },
];

// Mock data - should be fetched from API
const mockResourcePools: ResourcePool[] = [
  {
    id: "1",
    name: "kmitl-pool",
    description: "KMITL main resource pool",
    organizationName: "KMITL",
    createdAt: "2025-12-01",
    resources: [
      {
        id: "r1",
        poolId: "1",
        resourceTypeId: "1",
        resourceTypeName: "CPU",
        amount: 100,
        unit: "Core",
        price: 10,
        maxDuration: 24,
        createdAt: "2025-12-01",
      },
      {
        id: "r2",
        poolId: "1",
        resourceTypeId: "2",
        resourceTypeName: "GPU",
        amount: 50,
        unit: "GB",
        price: 50,
        maxDuration: 12,
        createdAt: "2025-12-01",
      },
      {
        id: "r3",
        poolId: "1",
        resourceTypeId: "3",
        resourceTypeName: "RAM",
        amount: 500,
        unit: "GB",
        price: 5,
        maxDuration: 24,
        createdAt: "2025-12-01",
      },
    ],
  },
  {
    id: "2",
    name: "research-pool",
    description: "Research department pool",
    organizationName: "Not Assigned",
    createdAt: "2025-12-10",
    resources: [
      {
        id: "r4",
        poolId: "2",
        resourceTypeId: "1",
        resourceTypeName: "CPU",
        amount: 64,
        unit: "Core",
        price: 8,
        maxDuration: 48,
        createdAt: "2025-12-10",
      },
    ],
  },
];

const ResourceTable = () => {
  return (
    <div className="space-y-4">
      {mockResourcePools.map((pool) => (
        <Card key={pool.id} className="w-full">
          <CardBody className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{pool.name}</h3>
                {pool.description && (
                  <p className="text-sm text-gray-500">{pool.description}</p>
                )}
                <div className="mt-2">
                  <Chip
                    size="sm"
                    color={
                      pool.organizationName === "Not Assigned"
                        ? "warning"
                        : "success"
                    }
                    variant="flat"
                  >
                    {pool.organizationName || "No Organization"}
                  </Chip>
                </div>
              </div>
              <AddResourceDialog poolId={pool.id} poolName={pool.name} />
            </div>

            <Table
              aria-label={`Resources in ${pool.name}`}
              className="min-w-full"
            >
              <TableHeader>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>NAME</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>UNIT</TableColumn>
                <TableColumn>ACTION</TableColumn>
              </TableHeader>
              <TableBody>
                {pool.resources && pool.resources.length > 0 ? (
                  pool.resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <Chip size="sm" color="primary" variant="flat">
                          {resource.resourceTypeName}
                        </Chip>
                      </TableCell>
                      <TableCell className="font-medium">
                        {resource.resourceTypeName} Pool
                      </TableCell>
                      <TableCell className="font-semibold">
                        {resource.amount}
                      </TableCell>
                      <TableCell>{resource.unit}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tooltip content="Edit resource">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="primary"
                              aria-label="Edit"
                            >
                              <EditIcon className="!w-4 !h-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Delete resource" color="danger">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              aria-label="Delete"
                            >
                              <DeleteIcon className="!w-4 !h-4" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-gray-500"
                    >
                      No resources added yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ResourceTable;
