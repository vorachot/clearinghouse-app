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
  { header: "TYPE", accessor: "type" },
  { header: "NAME", accessor: "name" },
  { header: "QUANTITY", accessor: "quantity" },
  { header: "UNIT", accessor: "unit" },
  { header: "ACTION", accessor: "action" },
];

const ResourceTable = ({ resourcePools }: { resourcePools: ResourcePool[] }) => {
  return (
    <Accordion variant="splitted" selectionMode="multiple">
      {resourcePools.map((pool) => (
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
              <CreateNodeDialog orgId={pool.organization_id} poolId={pool.id} poolName={pool.name} />
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
                        <h4 className="dark:text-white text-lg font-semibold flex items-center gap-2">
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
                        orgId={pool.organization_id}
                      />
                    </div>

                    <Table
                      aria-label={`Resources in ${node.name}`}
                      className="min-w-full"
                    >
                      <TableHeader>
                        {resourceColumns.map((col) => (
                          <TableColumn key={col.accessor}>
                            {col.header}
                          </TableColumn>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {node.resources && node.resources.length > 0 ? (
                          node.resources.map((resource) => (
                            <TableRow key={resource.id}>
                              <TableCell>
                                <Chip size="sm" color="primary" variant="flat">
                                  {resource.resource_type.name}
                                </Chip>
                              </TableCell>
                              <TableCell className="dark:text-white font-medium">
                                {resource.name}
                              </TableCell>
                              <TableCell className="dark:text-white font-semibold">
                                {resource.quantity}
                              </TableCell>
                              <TableCell className="dark:text-white">{resource.resource_type.unit}</TableCell>
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
