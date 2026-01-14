"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import NamespaceQuotaList from "./namespace-quota-list";
import NamespaceQuotaForm from "./namespace-quota-form";
import NamespaceQuotaTemplateForm from "./namespace-quota-template-form";
import NamespaceQuotaTemplateAssign from "./namespace-quota-template-assign";
import {
  NamespaceQuota,
  NamespaceQuotaTemplate,
  CreateNamespaceQuotaDTO,
  CreateQuotaTemplateDTO,
  AssignTemplateToNamespacesDTO,
} from "@/types/quota";
import { ProjectQuota } from "@/types/quota";
import { Namespace } from "@/types/namespace";

type NamespaceQuotaManagerProps = {
  namespaceQuotasByProject: NamespaceQuota[];
  namespaceQuotasByNamespace: NamespaceQuota[];
  templates: NamespaceQuotaTemplate[];
  namespaces: Namespace[];
  projectQuotas: ProjectQuota[];
  projectId: string;
  onCreateQuota: (data: CreateNamespaceQuotaDTO) => void;
  onCreateTemplate: (data: CreateQuotaTemplateDTO) => void;
  onAssignTemplate: (data: AssignTemplateToNamespacesDTO) => void;
};

export default function NamespaceQuotaManager({
  namespaceQuotasByProject,
  namespaceQuotasByNamespace,
  templates,
  namespaces,
  projectQuotas,
  projectId,
  onCreateQuota,
  onCreateTemplate,
  onAssignTemplate,
}: NamespaceQuotaManagerProps) {
  const [isQuotaFormOpen, setIsQuotaFormOpen] = useState(false);
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Namespace Quotas</h2>

      <Tabs aria-label="Namespace quota management" color="primary">
        <Tab key="quotas" title="Quotas">
          <Card>
            <CardBody className="p-4">
              <NamespaceQuotaList
                quotas={namespaceQuotasByNamespace}
                onCreateClick={() => setIsQuotaFormOpen(true)}
              />
            </CardBody>
          </Card>

          <NamespaceQuotaForm
            isOpen={isQuotaFormOpen}
            onClose={() => setIsQuotaFormOpen(false)}
            onSubmit={(data) => {
              onCreateQuota(data);
              setIsQuotaFormOpen(false);
            }}
            projectQuotas={projectQuotas}
          />
        </Tab>

        <Tab key="templates" title="Templates">
          <Card>
            <CardBody className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Quota Templates</h3>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-600 hover:cursor-pointer"
                    onClick={() => setIsTemplateFormOpen(true)}
                  >
                    Create Template
                  </button>
                  <button
                    className="px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-secondary-600 hover:cursor-pointer"
                    onClick={() => setIsAssignFormOpen(true)}
                  >
                    Assign Template
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="border">
                    <CardBody>
                      <h4 className="font-semibold text-lg">{template.name}</h4>
                      <p className="text-sm text-gray-500 mb-3">
                        {template.description}
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-gray-500">Project:</span>
                          <span className="ml-2 font-medium">
                            {template.projectName}
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="text-gray-500">Resources:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {template.resources?.map((r) => (
                              <span
                                key={r.id}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                              >
                                {r.resource_prop.resource.name}: {r.quantity}
                              </span>
                            )) || (
                              <span className="text-gray-500 text-xs">
                                No resources
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
                {templates.length === 0 && (
                  <p className="text-gray-500 col-span-3 text-center py-8">
                    No templates created yet
                  </p>
                )}
              </div>
            </CardBody>
          </Card>

          <NamespaceQuotaTemplateForm
            isOpen={isTemplateFormOpen}
            onClose={() => setIsTemplateFormOpen(false)}
            onSubmit={(data) => {
              onCreateTemplate(data);
              setIsTemplateFormOpen(false);
            }}
            namespaceQuotas={namespaceQuotasByProject}
            projectId={projectId}
          />

          <NamespaceQuotaTemplateAssign
            isOpen={isAssignFormOpen}
            onClose={() => setIsAssignFormOpen(false)}
            onSubmit={(data) => {
              onAssignTemplate(data);
              setIsAssignFormOpen(false);
            }}
            templates={templates}
            projectId={projectId}
            namespaces={namespaces}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
