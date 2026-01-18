"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { CreateOrganizationQuotaDTO } from "@/types/quota";
import { Organization } from "@/types/org";
import { ResourcePool } from "@/types/resource";
import { getResourcePoolsByOrgId } from "@/api/resource";
import useSWR from "swr";

type OrganizationQuotaFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrganizationQuotaDTO) => void;
  organizations: Organization[];
  orgId: string;
};

type ResourceFormItem = {
  resourceId: string;
  resourceName: string;
  resourceTypeId: string;
  resourceTypeName: string;
  quantity: number;
  maxQuantity: number;
  price: number;
  duration: number;
};

export default function OrganizationQuotaForm({
  isOpen,
  onClose,
  onSubmit,
  organizations,
  orgId,
}: OrganizationQuotaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fromOrgId: "",
    toOrgId: "",
    resourcePoolId: "",
    nodeId: "",
  });

  const [resources, setResources] = useState<ResourceFormItem[]>([]);

  // Auto-select the current organization when form opens
  useEffect(() => {
    if (orgId && !formData.fromOrgId) {
      setFormData((prev) => ({ ...prev, fromOrgId: orgId }));
    }
  }, [orgId]);

  const { data: resourcePoolsData, isLoading: isLoadingPools } = useSWR(
    formData.fromOrgId ? ["resourcePools", formData.fromOrgId] : null,
    () => getResourcePoolsByOrgId(formData.fromOrgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const availableResourcePools: ResourcePool[] = resourcePoolsData || [];
  const availableNodes = formData.resourcePoolId
    ? availableResourcePools.find(
        (pool: ResourcePool) => pool.id === formData.resourcePoolId
      )?.nodes || []
    : [];
  const selectedNode = availableNodes.find(
    (node) => node.id === formData.nodeId
  );
  const nodeResources = selectedNode?.resources || [];

  useEffect(() => {
    if (formData.nodeId && nodeResources.length > 0) {
      setResources(
        nodeResources.map((resource) => ({
          resourceId: resource.id,
          resourceName: resource.name,
          resourceTypeId: resource.resource_type_id,
          resourceTypeName: resource.resource_type?.name || "Unknown",
          quantity: 0,
          maxQuantity: resource.quantity,
          price: 0.01,
          duration: 1,
        }))
      );
    } else {
      setResources([]);
    }
  }, [formData.nodeId]);

  const handleResourceChange = (
    resourceId: string,
    field: keyof ResourceFormItem,
    value: string | number
  ) => {
    setResources(
      resources.map((r) =>
        r.resourceId === resourceId ? { ...r, [field]: value } : r
      )
    );
  };

  const handleSubmit = () => {
    const dto: CreateOrganizationQuotaDTO = {
      name: formData.name,
      description: formData.description,
      from_organization_id: formData.fromOrgId,
      to_organization_id: formData.toOrgId,
      node_id: formData.nodeId,
      resources: resources
        .filter((r) => r.quantity > 0)
        .map((r) => ({
          resource_id: r.resourceId,
          quantity: r.quantity,
          price: r.price,
          duration: r.duration * 3600,
        })),
    };
    onSubmit(dto);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      fromOrgId: "",
      toOrgId: "",
      resourcePoolId: "",
      nodeId: "",
    });
    setResources([]);
  };

  const isFormValid =
    formData.name &&
    formData.fromOrgId &&
    formData.toOrgId &&
    formData.nodeId &&
    resources.length > 0 &&
    resources.some((r) => r.quantity > 0) &&
    resources.filter((r) => r.quantity > 0).every((r) => r.price >= 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="dark:text-white">
          Create Organization Quota
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <h3 className="dark:text-white text-lg font-semibold">
                  Basic Information
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Enter quota name"
                  value={formData.name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  isRequired
                />
                <Textarea
                  label="Description"
                  placeholder="Enter quota description"
                  value={formData.description}
                  onValueChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                />
              </CardBody>
            </Card>

            {/* Organization Selection */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Organization Selection
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="From Organization"
                  placeholder="Select source organization"
                  selectedKeys={formData.fromOrgId ? [formData.fromOrgId] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setFormData({
                      ...formData,
                      fromOrgId: key,
                      resourcePoolId: "",
                      nodeId: "",
                    });
                  }}
                  isRequired
                >
                  <SelectItem key={orgId} className="dark:text-white">
                    {organizations.find((org) => org.id === orgId)?.name || ""}
                  </SelectItem>
                </Select>

                <Select
                  label="To Organization"
                  placeholder="Select target organization"
                  selectedKeys={formData.toOrgId ? [formData.toOrgId] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setFormData({ ...formData, toOrgId: key });
                  }}
                  isRequired
                >
                  {organizations
                    .filter((org) => org.id !== formData.fromOrgId)
                    .map((org) => (
                      <SelectItem key={org.id} className="dark:text-white">
                        {org.name}
                      </SelectItem>
                    ))}
                </Select>

                <Select
                  label="Resource Pool"
                  placeholder="Select resource pool"
                  selectedKeys={
                    formData.resourcePoolId ? [formData.resourcePoolId] : []
                  }
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setFormData({
                      ...formData,
                      resourcePoolId: key,
                      nodeId: "",
                    });
                  }}
                  isDisabled={!formData.fromOrgId || isLoadingPools}
                  isRequired
                >
                  {availableResourcePools.map((pool) => (
                    <SelectItem key={pool.id} className="dark:text-white">
                      {pool.name}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Node"
                  placeholder="Select node"
                  selectedKeys={formData.nodeId ? [formData.nodeId] : []}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setFormData({ ...formData, nodeId: key });
                  }}
                  isDisabled={!formData.resourcePoolId || isLoadingPools}
                  isRequired
                >
                  {availableNodes.map((node) => (
                    <SelectItem key={node.id} className="dark:text-white">
                      {node.name}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Resources</h3>
              </CardHeader>
              <CardBody>
                {resources.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {formData.nodeId
                      ? "No resources available in this node"
                      : "Select a node to view available resources"}
                  </p>
                ) : (
                  <Table aria-label="Resources table">
                    <TableHeader>
                      <TableColumn>RESOURCE TYPE</TableColumn>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>AVAILABLE</TableColumn>
                      <TableColumn>QUANTITY</TableColumn>
                      <TableColumn>PRICE (credits)</TableColumn>
                      <TableColumn>DURATION (hrs)</TableColumn>
                      {/* <TableColumn>TOTAL</TableColumn> */}
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.resourceId}>
                          <TableCell>
                            <span className="font-medium">
                              {resource.resourceTypeName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {resource.resourceName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {resource.maxQuantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <Slider
                                size="sm"
                                step={1}
                                minValue={0}
                                maxValue={resource.maxQuantity}
                                value={resource.quantity}
                                onChange={(value) =>
                                  handleResourceChange(
                                    resource.resourceId,
                                    "quantity",
                                    value as number
                                  )
                                }
                                className="max-w-md"
                              />
                              <span className="text-xs text-default-500">
                                {resource.quantity} / {resource.maxQuantity}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={resource.price.toString()}
                              onValueChange={(value) =>
                                handleResourceChange(
                                  resource.resourceId,
                                  "price",
                                  parseFloat(value) || 0
                                )
                              }
                              size="sm"
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0.5"
                              step="0.5"
                              value={resource.duration.toString()}
                              onValueChange={(value) =>
                                handleResourceChange(
                                  resource.resourceId,
                                  "duration",
                                  parseFloat(value) || 1
                                )
                              }
                              size="sm"
                              className="w-24"
                            />
                          </TableCell>
                          {/* <TableCell>
                            <span className="font-semibold">
                              $
                              {(
                                resource.quantity *
                                resource.price *
                                resource.duration
                              ).toFixed(2)}
                            </span>
                          </TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardBody>
            </Card>

            {/* Total Summary */}
            {/* {resources.length > 0 && resources.some((r) => r.quantity > 0) && (
              <Card>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      $
                      {resources
                        .filter((r) => r.quantity > 0)
                        .reduce(
                          (sum, r) => sum + r.quantity * r.price * r.duration,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </CardBody>
              </Card>
            )} */}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isDisabled={!isFormValid}
          >
            Create Quota
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
