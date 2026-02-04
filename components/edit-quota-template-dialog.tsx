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
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox, CheckboxGroup } from "@heroui/checkbox";
import { Chip } from "@heroui/chip";
import {
  NamespaceQuotaTemplate,
  UpdateQuotaTemplateDTO,
  NamespaceQuota,
} from "@/types/quota";
import LayersIcon from "@mui/icons-material/Layers";

interface EditQuotaTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (templateId: string, data: UpdateQuotaTemplateDTO) => Promise<void>;
  template: NamespaceQuotaTemplate | null;
  namespaceQuotas: NamespaceQuota[];
}

const EditQuotaTemplateDialog = ({
  isOpen,
  onClose,
  onSubmit,
  template,
  namespaceQuotas,
}: EditQuotaTemplateDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuotaIds, setSelectedQuotaIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description || "");
      // Extract quota IDs from the template's quotas
      const quotaIds = template.quotas?.map((q) => q.id) || [];
      setSelectedQuotaIds(quotaIds);
    }
  }, [template]);

  const handleSubmit = async () => {
    if (!template) return;

    setIsSubmitting(true);
    try {
      const updateData: UpdateQuotaTemplateDTO = {
        name,
        description,
        quota_ids: selectedQuotaIds,
      };
      await onSubmit(template.id, updateData);
      handleClose();
    } catch (error) {
      console.error("Error updating template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setSelectedQuotaIds([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Edit Quota Template
        </ModalHeader>
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
                  value={name}
                  onValueChange={setName}
                  isRequired
                  variant="bordered"
                />
                <Textarea
                  label="Description"
                  placeholder="Enter template description"
                  value={description}
                  onValueChange={setDescription}
                  variant="bordered"
                  minRows={3}
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
                            <span className="font-medium">
                              {quota.name}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 ml-7">
                            {quota.resources?.map((resource) => (
                              <Chip
                                key={resource.id}
                                size="sm"
                                variant="flat"
                                color="primary"
                              >
                                {
                                  resource.resource_prop?.resource
                                    ?.resource_type?.name
                                }
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
          <Button color="danger" variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!name.trim() || selectedQuotaIds.length === 0}
          >
            Update Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditQuotaTemplateDialog;
