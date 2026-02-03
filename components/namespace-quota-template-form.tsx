"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import { CreateQuotaTemplateDTO, NamespaceQuota } from "@/types/quota";
import LayersIcon from "@mui/icons-material/Layers";

type NamespaceQuotaTemplateFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateQuotaTemplateDTO) => void;
  namespaceQuotas: NamespaceQuota[];
  projectId: string;
};

export default function NamespaceQuotaTemplateForm({
  isOpen,
  onClose,
  onSubmit,
  namespaceQuotas,
  projectId,
}: NamespaceQuotaTemplateFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [selectedQuotaIds, setSelectedQuotaIds] = useState<string[]>([]);

  const handleSubmit = () => {
    const dto: CreateQuotaTemplateDTO = {
      name: formData.name,
      description: formData.description,
      project_id: projectId,
      quota_ids: selectedQuotaIds,
    };

    onSubmit(dto);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
    });
    setSelectedQuotaIds([]);
  };

  const isFormValid = formData.name && selectedQuotaIds.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Create Quota Template</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Template Information</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <Input
                  label="Template Name"
                  placeholder="Enter template name"
                  value={formData.name}
                  onValueChange={(value) =>
                    setFormData({ ...formData, name: value })
                  }
                  isRequired
                />
                <Textarea
                  label="Description"
                  placeholder="Enter template description"
                  value={formData.description}
                  onValueChange={(value) =>
                    setFormData({ ...formData, description: value })
                  }
                />
              </CardBody>
            </Card>

            {/* Quota Selection */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">
                  Source Namespace Quotas
                </h3>
              </CardHeader>
              <CardBody>
                {namespaceQuotas.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No namespace quotas found for this project
                  </p>
                ) : (
                  <CheckboxGroup
                    value={selectedQuotaIds}
                    onValueChange={setSelectedQuotaIds}
                    label="Select one or more quotas to use as template source"
                    description="Resources will be aggregated from selected quotas"
                  >
                    {namespaceQuotas.map((quota) => (
                      <Checkbox key={quota.id} value={quota.id}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <LayersIcon
                              className="text-secondary"
                              fontSize="small"
                            />
                            <p className="font-semibold">{quota.name}</p>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {quota.resources.map((resource) => (
                              <Chip key={resource.id} size="sm" variant="flat">
                                {resource.resource_prop.resource.resource_type
                                  ?.name || "Unknown"}
                                : {resource.quantity}
                              </Chip>
                            ))}
                          </div>
                        </div>
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
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
            Create Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
