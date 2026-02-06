"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Slider } from "@heroui/slider";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { NamespaceQuota, UpdateNamespaceQuotaDTO } from "@/types/quota";
import { EditRounded } from "@mui/icons-material";

type EditNamespaceQuotaDialogProps = {
  isOpen: boolean;
  quota: NamespaceQuota | null;
  onClose: () => void;
  onConfirm: (quotaId: string, data: UpdateNamespaceQuotaDTO) => void;
  isUpdating?: boolean;
  error?: string | null;
};

type ResourceFormItem = {
  resourceId: string;
  resourceName: string;
  resourceTypeName: string;
  unit: string;
  quantity: number;
  maxQuantity: number;
};

const EditNamespaceQuotaDialog = ({
  isOpen,
  quota,
  onClose,
  onConfirm,
  isUpdating = false,
  error,
}: EditNamespaceQuotaDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [resources, setResources] = useState<ResourceFormItem[]>([]);

  useEffect(() => {
    if (quota) {
      setFormData({
        name: quota.name,
        description: "",
      });

      setResources(
        quota.resources.map((r) => ({
          resourceId: r.resource_prop.resource_id,
          resourceName: r.resource_prop.resource.name,
          resourceTypeName: r.resource_prop.resource.resource_type.name,
          unit: r.resource_prop.resource.resource_type.unit,
          quantity: r.quantity,
          maxQuantity: r.quantity, // Current quantity as max for now
        })),
      );
    }
  }, [quota]);

  const handleResourceChange = (resourceId: string, quantity: number) => {
    setResources(
      resources.map((r) =>
        r.resourceId === resourceId ? { ...r, quantity } : r,
      ),
    );
  };

  const handleSubmit = () => {
    if (!quota) return;

    const dto: UpdateNamespaceQuotaDTO = {
      name: formData.name,
      description: formData.description || "-",
      resources: resources.map((r) => ({
        resource_id: r.resourceId,
        quantity: r.quantity,
      })),
    };

    onConfirm(quota.id, dto);
  };

  const handleClose = () => {
    onClose();
  };

  const isFormValid =
    formData.name &&
    resources.length > 0 &&
    resources.some((r) => r.quantity > 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <EditRounded className="!w-6 !h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-gray-900 dark:text-white">
              Edit Namespace Quota
            </span>
          </div>
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
                {quota && (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Organization:</span>
                      <span className="font-medium text-success-600">
                        {quota.organization_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Node:</span>
                      <span className="font-medium text-secondary-600">
                        {quota.node_name}
                      </span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Resources */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold dark:text-white">
                  Configure Resource Allocation
                </h3>
              </CardHeader>
              <CardBody>
                {resources.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No resources available
                  </p>
                ) : (
                  <Table aria-label="Resources table">
                    <TableHeader>
                      <TableColumn>RESOURCE TYPE</TableColumn>
                      <TableColumn>NAME</TableColumn>
                      <TableColumn>UNIT</TableColumn>
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
                              {resource.unit}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <Slider
                                size="sm"
                                step={1}
                                minValue={0}
                                maxValue={resource.maxQuantity * 2}
                                value={resource.quantity}
                                onChange={(value) =>
                                  handleResourceChange(
                                    resource.resourceId,
                                    value as number,
                                  )
                                }
                                className="max-w-md"
                              />
                              <span className="text-xs text-default-500">
                                {resource.quantity} {resource.unit}
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

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleClose}
            isDisabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isUpdating}
            isDisabled={isUpdating || !isFormValid}
          >
            {isUpdating ? "Updating..." : "Update Quota"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditNamespaceQuotaDialog;
