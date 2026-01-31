"use client";

import { useState } from "react";
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
import DeleteResourcePoolDialog from "./delete-resource-pool-dialog";
import DeleteResourceNodeDialog from "./delete-resource-node-dialog";
import DeleteResourceDialog from "./delete-resource-dialog";
import type { ResourcePool } from "@/types/resource";

const resourceColumns = [
  { header: "TYPE", accessor: "type" },
  { header: "NAME", accessor: "name" },
  { header: "QUANTITY", accessor: "quantity" },
  { header: "UNIT", accessor: "unit" },
  { header: "ACTION", accessor: "action" },
];

type Props = {
  resourcePools: ResourcePool[];
  onDelete?: (poolId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDeleteResource?: (resourceId: string) => void;
};

const ResourceTable = ({
  resourcePools,
  onDelete,
  onDeleteNode,
  onDeleteResource,
}: Props) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const [selectedPoolName, setSelectedPoolName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteNodeDialogOpen, setDeleteNodeDialogOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [selectedNodeName, setSelectedNodeName] = useState<string>("");
  const [isDeletingNode, setIsDeletingNode] = useState(false);
  const [nodeError, setNodeError] = useState<string | null>(null);

  const [deleteResourceDialogOpen, setDeleteResourceDialogOpen] =
    useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [selectedResourceName, setSelectedResourceName] = useState<string>("");
  const [isDeletingResource, setIsDeletingResource] = useState(false);
  const [resourceError, setResourceError] = useState<string | null>(null);

  const handleDelete = (poolId: string, poolName: string) => {
    setSelectedPoolId(poolId);
    setSelectedPoolName(poolName);
    setDeleteDialogOpen(true);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (onDelete && selectedPoolId) {
      setIsDeleting(true);
      try {
        await onDelete(selectedPoolId);
        setDeleteDialogOpen(false);
      } catch (error: any) {
        console.error("Error deleting resource pool:", error);
        setError(
          error.response?.data?.error || "Failed to delete resource pool",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteNode = (nodeId: string, nodeName: string) => {
    setSelectedNodeId(nodeId);
    setSelectedNodeName(nodeName);
    setDeleteNodeDialogOpen(true);
    setNodeError(null);
  };

  const handleConfirmDeleteNode = async () => {
    if (onDeleteNode && selectedNodeId) {
      setIsDeletingNode(true);
      try {
        await onDeleteNode(selectedNodeId);
        setDeleteNodeDialogOpen(false);
      } catch (error: any) {
        console.error("Error deleting resource node:", error);
        setNodeError(
          error.response?.data?.error || "Failed to delete resource node",
        );
      } finally {
        setIsDeletingNode(false);
      }
    }
  };

  const handleDeleteResource = (resourceId: string, resourceName: string) => {
    setSelectedResourceId(resourceId);
    setSelectedResourceName(resourceName);
    setDeleteResourceDialogOpen(true);
    setResourceError(null);
  };

  const handleConfirmDeleteResource = async () => {
    if (onDeleteResource && selectedResourceId) {
      setIsDeletingResource(true);
      try {
        await onDeleteResource(selectedResourceId);
        setDeleteResourceDialogOpen(false);
      } catch (error: any) {
        console.error("Error deleting resource:", error);
        setResourceError(
          error.response?.data?.error || "Failed to delete resource",
        );
      } finally {
        setIsDeletingResource(false);
      }
    }
  };
  return (
    <>
      <Accordion variant="splitted" selectionMode="multiple">
        {resourcePools.map((pool) => (
          <AccordionItem
            key={pool.id}
            aria-label={pool.name}
            title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{pool.name}</h3>
                  {pool.nodes && pool.nodes.length > 0 && (
                    <Chip size="sm" color="primary" variant="flat">
                      {pool.nodes.length}{" "}
                      {pool.nodes.length === 1 ? "Node" : "Nodes"}
                    </Chip>
                  )}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pool.id, pool.name);
                  }}
                  className="p-2 rounded-lg hover:bg-danger-100 dark:hover:bg-danger-900/20 cursor-pointer transition-colors"
                  role="button"
                  aria-label="Delete pool"
                >
                  <Tooltip content="Delete pool" color="danger">
                    <DeleteIcon className="!w-4 !h-4 text-danger" />
                  </Tooltip>
                </div>
              </div>
            }
            // subtitle={pool.description}
          >
            <div className="px-2 pb-4">
              <div className="flex justify-end mb-4">
                <CreateNodeDialog
                  orgId={pool.organization_id}
                  poolId={pool.id}
                  poolName={pool.name}
                />
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
                        <div className="flex items-center gap-2">
                          <AddResourceDialog
                            nodeId={node.id}
                            nodeName={node.name}
                            orgId={pool.organization_id}
                          />
                          <div onClick={(e) => e.stopPropagation()}>
                            <Tooltip content="Delete node" color="danger">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                aria-label="Delete node"
                                onPress={() =>
                                  handleDeleteNode(node.id, node.name)
                                }
                              >
                                <DeleteIcon className="!w-4 !h-4" />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
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
                                  <Chip
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                  >
                                    {resource.resource_type.name}
                                  </Chip>
                                </TableCell>
                                <TableCell className="dark:text-white font-medium">
                                  {resource.name}
                                </TableCell>
                                <TableCell className="dark:text-white font-semibold">
                                  {resource.quantity}
                                </TableCell>
                                <TableCell className="dark:text-white">
                                  {resource.resource_type.unit}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div onClick={(e) => e.stopPropagation()}>
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
                                    </div>
                                    <div onClick={(e) => e.stopPropagation()}>
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
                                          onPress={() =>
                                            handleDeleteResource(
                                              resource.id,
                                              resource.name,
                                            )
                                          }
                                        >
                                          <DeleteIcon className="!w-4 !h-4" />
                                        </Button>
                                      </Tooltip>
                                    </div>
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
      <DeleteResourcePoolDialog
        isOpen={deleteDialogOpen}
        poolName={selectedPoolName}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={error}
      />
      <DeleteResourceNodeDialog
        isOpen={deleteNodeDialogOpen}
        nodeName={selectedNodeName}
        onClose={() => setDeleteNodeDialogOpen(false)}
        onConfirm={handleConfirmDeleteNode}
        isDeleting={isDeletingNode}
        error={nodeError}
      />
      <DeleteResourceDialog
        isOpen={deleteResourceDialogOpen}
        resourceName={selectedResourceName}
        onClose={() => setDeleteResourceDialogOpen(false)}
        onConfirm={handleConfirmDeleteResource}
        isDeleting={isDeletingResource}
        error={resourceError}
      />
    </>
  );
};

export default ResourceTable;
