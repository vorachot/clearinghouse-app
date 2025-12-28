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
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Accordion, AccordionItem } from "@heroui/accordion";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddResourceDialog from "./add-resource-dialog";
import CreateNodeDialog from "./create-node-dialog";
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
    nodes: [
      {
        id: "n1",
        poolId: "1",
        name: "node-01",
        description: "Primary compute node",
        createdAt: "2025-12-01",
        resources: [
          {
            id: "r1",
            nodeId: "n1",
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
            nodeId: "n1",
            poolId: "1",
            resourceTypeId: "2",
            resourceTypeName: "GPU",
            amount: 50,
            unit: "GB",
            price: 50,
            maxDuration: 12,
            createdAt: "2025-12-01",
          },
        ],
      },
      {
        id: "n2",
        poolId: "1",
        name: "node-02",
        description: "Secondary compute node",
        createdAt: "2025-12-02",
        resources: [
          {
            id: "r3",
            nodeId: "n2",
            poolId: "1",
            resourceTypeId: "3",
            resourceTypeName: "RAM",
            amount: 500,
            unit: "GB",
            price: 5,
            maxDuration: 24,
            createdAt: "2025-12-02",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "research-pool",
    description: "Research department pool",
    organizationName: "Not Assigned",
    createdAt: "2025-12-10",
    nodes: [
      {
        id: "n3",
        poolId: "2",
        name: "research-node-01",
        description: "Research compute node",
        createdAt: "2025-12-10",
        resources: [
          {
            id: "r4",
            nodeId: "n3",
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
    ],
  },
];

const ResourceTable = () => {
  return (
    <Accordion variant="splitted" selectionMode="multiple">
      {mockResourcePools.map((pool) => (
        <AccordionItem
          key={pool.id}
          aria-label={pool.name}
          title={
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{pool.name}</h3>
              {pool.nodes && pool.nodes.length > 0 && (
                <Chip size="sm" color="primary" variant="flat">
                  {pool.nodes.length}{" "}
                  {pool.nodes.length === 1 ? "Node" : "Nodes"}
                </Chip>
              )}
            </div>
          }
          // subtitle={pool.description}
        >
          <div className="px-2 pb-4">
            <div className="flex justify-end mb-4">
              <CreateNodeDialog poolId={pool.id} poolName={pool.name} />
            </div>

            {/* Nodes Section */}
            <div className="space-y-4">
              {pool.nodes && pool.nodes.length > 0 ? (
                pool.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold flex items-center gap-2">
                          <Chip size="sm" color="secondary" variant="flat">
                            NODE
                          </Chip>
                          {node.name}
                        </h4>
                        {/* {node.description && (
                          <p className="text-sm text-gray-500 ml-16">
                            {node.description}
                          </p>
                        )} */}
                      </div>
                      <AddResourceDialog
                        nodeId={node.id}
                        nodeName={node.name}
                        poolId={pool.id}
                      />
                    </div>

                    <Table
                      aria-label={`Resources in ${node.name}`}
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
                        {node.resources && node.resources.length > 0 ? (
                          node.resources.map((resource) => (
                            <TableRow key={resource.id}>
                              <TableCell>
                                <Chip size="sm" color="primary" variant="flat">
                                  {resource.resourceTypeName}
                                </Chip>
                              </TableCell>
                              <TableCell className="font-medium">
                                {resource.resourceTypeName} Resource
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
                                  <Tooltip
                                    content="Delete resource"
                                    color="danger"
                                  >
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
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No nodes created yet. Click &quot;Add Node&quot; to get
                  started.
                </div>
              )}
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ResourceTable;
