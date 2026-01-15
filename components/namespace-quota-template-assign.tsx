"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
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
import {
  AssignTemplateToNamespacesDTO,
  NamespaceQuotaTemplate,
} from "@/types/quota";
import { Namespace } from "@/types/namespace";

type NamespaceQuotaTemplateAssignProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignTemplateToNamespacesDTO) => void;
  templates: NamespaceQuotaTemplate[];
  namespaces: Namespace[];
  projectId: string;
};

export default function NamespaceQuotaTemplateAssign({
  isOpen,
  onClose,
  onSubmit,
  templates,
  namespaces,
  projectId,
}: NamespaceQuotaTemplateAssignProps) {
  const [templateId, setTemplateId] = useState("");
  const [selectedNamespaceIds, setSelectedNamespaceIds] = useState<string[]>(
    []
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<NamespaceQuotaTemplate | null>(null);

  useEffect(() => {
    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [templateId, templates]);

  const handleSubmit = () => {
    const dto: AssignTemplateToNamespacesDTO = {
      namespaces: selectedNamespaceIds,
      project_id: projectId,
      quota_template_id: templateId,
    };

    onSubmit(dto);
    handleReset();
  };

  const handleReset = () => {
    setTemplateId("");
    setSelectedNamespaceIds([]);
    setSelectedTemplate(null);
  };

  const isFormValid = templateId && selectedNamespaceIds.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Assign Template to Namespaces</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Select Template</h3>
              </CardHeader>
              <CardBody>
                {templates.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No templates found for this project
                  </p>
                ) : (
                  <Select
                    label="Template"
                    placeholder="Select quota template"
                    selectedKeys={templateId ? [templateId] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys)[0] as string;
                      setTemplateId(key);
                    }}
                    isRequired
                  >
                    {templates?.map((template) => (
                      <SelectItem
                        key={template.id}
                        textValue={template.name}
                        className="dark:text-white"
                      >
                        <div>
                          <p className="font-semibold">{template.name}</p>
                          <p className="text-xs text-gray-500">
                            {template.description}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                )}
              </CardBody>
            </Card>

            {/* Template Preview */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Template Resources</h3>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.quotas?.flatMap((quota) =>
                      quota.resources?.map((resource) => (
                        <Chip key={resource.id} color="primary" variant="flat">
                          {resource.resource_prop.resource.resource_type
                            ?.name || "Unknown"}
                          : {resource.quantity}
                        </Chip>
                      ))
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
            {/* Namespace Selection */}
            {templateId && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Select Target Namespaces
                  </h3>
                </CardHeader>
                <CardBody>
                  {namespaces.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No namespaces found for this project
                    </p>
                  ) : (
                    <CheckboxGroup
                      value={selectedNamespaceIds}
                      onValueChange={setSelectedNamespaceIds}
                      label="Select namespaces to assign this template"
                      description={`Selected: ${selectedNamespaceIds.length} namespace(s)`}
                    >
                      {namespaces.map((namespace) => (
                        <Checkbox key={namespace.id} value={namespace.id}>
                          <div>
                            <p className="font-semibold">{namespace.name}</p>
                            {namespace.description && (
                              <p className="text-xs text-gray-500">
                                {namespace.description}
                              </p>
                            )}
                          </div>
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Summary */}
            {isFormValid && (
              <Card className="bg-primary-50 dark:bg-primary-950 border-primary">
                <CardBody>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-primary">
                      Assignment Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Template:</p>
                        <p className="font-semibold">
                          {selectedTemplate?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Target Namespaces:</p>
                        <p className="font-semibold">
                          {selectedNamespaceIds.length} namespace(s)
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 pt-2">
                      This will create {selectedNamespaceIds.length} new
                      namespace quota(s) based on the selected template.
                    </p>
                  </div>
                </CardBody>
              </Card>
            )}
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
            Assign Template
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
