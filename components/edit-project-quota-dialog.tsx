"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { EditRounded } from "@mui/icons-material";
import {
  ProjectQuota,
  UpdateProjectQuotaDTO,
  UpdateProjectQuotaInternalDTO,
} from "@/types/quota";

type ResourceFormItem = {
  resourceId: string;
  resourceTypeName: string;
  unit: string;
  quantity: number;
  price: number;
  duration: number;
};

type EditProjectQuotaDialogProps = {
  isOpen: boolean;
  quota: ProjectQuota | null;
  isInternal: boolean;
  isUpdating?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (
    quotaId: string,
    data: UpdateProjectQuotaDTO | UpdateProjectQuotaInternalDTO,
  ) => void;
};

const EditProjectQuotaDialog = ({
  isOpen,
  quota,
  isInternal,
  isUpdating = false,
  error,
  onClose,
  onConfirm,
}: EditProjectQuotaDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [resources, setResources] = useState<ResourceFormItem[]>([]);

  useEffect(() => {
    if (!quota) return;

    setName(quota.name);
    setDescription(quota.description || "");
    setResources(
      quota.resources.map((resource) => ({
        resourceId: resource.resource_prop.resource_id,
        resourceTypeName:
          resource.resource_prop.resource.resource_type?.name || "Unknown",
        unit: resource.resource_prop.resource.resource_type?.unit || "",
        quantity: resource.quantity,
        price: resource.resource_prop.price || 0,
        duration: resource.resource_prop.max_duration || 1,
      })),
    );
  }, [quota]);

  const updateResourceField = (
    resourceId: string,
    field: keyof ResourceFormItem,
    value: number,
  ) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.resourceId === resourceId
          ? { ...resource, [field]: value }
          : resource,
      ),
    );
  };

  const handleSubmit = () => {
    if (!quota) return;

    if (isInternal) {
      const payload: UpdateProjectQuotaInternalDTO = {
        name,
        description,
        resources: resources.map((resource) => ({
          resource_id: resource.resourceId,
          quantity: Math.max(0, Math.floor(resource.quantity || 0)),
          price: Math.max(0, resource.price || 0),
          duration: Math.max(1, Math.floor(resource.duration || 1)),
        })),
      };
      onConfirm(quota.id, payload);
      return;
    }

    const payload: UpdateProjectQuotaDTO = {
      name,
      description,
      resources: resources.map((resource) => ({
        resource_id: resource.resourceId,
        quantity: Math.max(0, Math.floor(resource.quantity || 0)),
      })),
    };

    onConfirm(quota.id, payload);
  };

  const isValid =
    name.trim().length > 0 &&
    resources.length > 0 &&
    resources.every((resource) =>
      isInternal ? resource.price >= 0 && resource.duration >= 1 : true,
    );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <EditRounded className="!w-5 !h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <span>Edit {isInternal ? "Internal" : "External"} Project Quota</span>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            label="Name"
            value={name}
            onValueChange={setName}
            placeholder="Quota name"
            isRequired
          />
          <Textarea
            label="Description"
            value={description}
            onValueChange={setDescription}
            placeholder="Quota description"
          />

          {isInternal ? (
            <Table aria-label="Edit project quota resources">
              <TableHeader>
                <TableColumn>RESOURCE TYPE</TableColumn>
                <TableColumn>QUANTITY</TableColumn>
                <TableColumn>PRICE</TableColumn>
                <TableColumn>DURATION (SECONDS)</TableColumn>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.resourceId}>
                    <TableCell>
                      {resource.resourceTypeName}
                      {resource.unit ? ` (${resource.unit})` : ""}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={String(resource.quantity)}
                        onValueChange={(value) =>
                          updateResourceField(
                            resource.resourceId,
                            "quantity",
                            Number(value) || 0,
                          )
                        }
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={String(resource.price)}
                        onValueChange={(value) =>
                          updateResourceField(
                            resource.resourceId,
                            "price",
                            Number(value) || 0,
                          )
                        }
                        size="sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={String(resource.duration)}
                        onValueChange={(value) =>
                          updateResourceField(
                            resource.resourceId,
                            "duration",
                            Number(value) || 1,
                          )
                        }
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table aria-label="Edit project quota resources">
              <TableHeader>
                <TableColumn>RESOURCE TYPE</TableColumn>
                <TableColumn>QUANTITY</TableColumn>
              </TableHeader>
              <TableBody>
                {resources.map((resource) => (
                  <TableRow key={resource.resourceId}>
                    <TableCell>
                      {resource.resourceTypeName}
                      {resource.unit ? ` (${resource.unit})` : ""}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={String(resource.quantity)}
                        onValueChange={(value) =>
                          updateResourceField(
                            resource.resourceId,
                            "quantity",
                            Number(value) || 0,
                          )
                        }
                        size="sm"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isUpdating}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isUpdating}
            isDisabled={!isValid || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Quota"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProjectQuotaDialog;
