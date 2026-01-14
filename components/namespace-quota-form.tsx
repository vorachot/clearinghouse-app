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
import { CreateNamespaceQuotaDTO, ProjectQuota } from "@/types/quota";

type NamespaceQuotaFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNamespaceQuotaDTO) => void;
  projectQuotas: ProjectQuota[];
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

export default function NamespaceQuotaForm({
  isOpen,
  onClose,
  onSubmit,
  projectQuotas,
}: NamespaceQuotaFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectQuotaId: "",
  });

  const [resources, setResources] = useState<ResourceFormItem[]>([]);
  const [selectedProjectQuota, setSelectedProjectQuota] =
    useState<ProjectQuota | null>(null);
  useEffect(() => {
    if (formData.projectQuotaId) {
      const quota = projectQuotas.find((q) => q.id === formData.projectQuotaId);
      setSelectedProjectQuota(quota || null);

      if (quota) {
        // Initialize resource form items from project quota resources
        setResources(
          quota.resources.map((r) => ({
            resourceId: r.resource_prop.resource_id,
            resourceName: r.resource_prop.resource.name,
            resourceTypeId: r.resource_prop.resource.resource_type_id,
            resourceTypeName:
              r.resource_prop.resource.resource_type?.name || "Unknown",
            quantity: 0,
            maxQuantity: r.quantity,
            price: r.resource_prop.price,
            duration: r.resource_prop.max_duration / 3600, // Convert seconds to hours
          }))
        );
      }
    } else {
      setSelectedProjectQuota(null);
      setResources([]);
    }
  }, [formData.projectQuotaId, projectQuotas]);

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
    if (!selectedProjectQuota) return;

    const dto: CreateNamespaceQuotaDTO = {
      name: formData.name,
      description: formData.description ? formData.description : "-",
      project_id: selectedProjectQuota.project_id,
      project_quota_id: formData.projectQuotaId,
      node_id: selectedProjectQuota.node_id,
      resources: resources
        .filter((r) => r.quantity > 0)
        .map((r) => ({
          resource_id: r.resourceId,
          quantity: r.quantity,
        })),
    };

    onSubmit(dto);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      projectQuotaId: "",
    });
    setResources([]);
    setSelectedProjectQuota(null);
  };

  const isFormValid =
    formData.name &&
    formData.projectQuotaId &&
    resources.length > 0 &&
    resources.some((r) => r.quantity > 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="dark:text-white">
          Create Namespace Quota
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

            {/* Project Quota & Namespace Selection */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Project Quota & Namespace Selection
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Select
                  label="Project Quota"
                  placeholder="Select project quota"
                  selectedKeys={
                    formData.projectQuotaId ? [formData.projectQuotaId] : []
                  }
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setFormData({ ...formData, projectQuotaId: key });
                  }}
                  isRequired
                >
                  {projectQuotas.map((quota) => (
                    <SelectItem
                      key={quota.id}
                      className="dark:text-white"
                      textValue={quota.name}
                    >
                      <div>
                        <p className="font-semibold">{quota.name}</p>
                        <p className="text-xs text-gray-500">
                          {quota.resources.length} resources available
                        </p>
                      </div>
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Node"
                  value={
                    selectedProjectQuota
                      ? selectedProjectQuota.node_id
                      : "Select project quota first"
                  }
                  isReadOnly
                  description="Node is auto-filled from project quota"
                />
              </CardBody>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Configure Resource Allocation
                </h3>
              </CardHeader>
              <CardBody>
                {resources.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {formData.projectQuotaId
                      ? "No resources available in this project quota"
                      : "Select a project quota to view available resources"}
                  </p>
                ) : (
                  <Table aria-label="Resources table">
                    <TableHeader>
                      <TableColumn>RESOURCE TYPE</TableColumn>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>AVAILABLE</TableColumn>
                      <TableColumn>QUANTITY</TableColumn>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardBody>
            </Card>
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
