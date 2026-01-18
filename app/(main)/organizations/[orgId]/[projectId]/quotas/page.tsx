"use client";

import { Card, CardBody } from "@heroui/card";
import {
  AssignTemplateToNamespacesDTO,
  CreateNamespaceQuotaDTO,
  CreateQuotaTemplateDTO,
  OrganizationQuota,
  ProjectQuota,
  CreateProjectQuotaDTO,
  CreateProjectQuotaInternalDTO,
  NamespaceQuota,
  NamespaceQuotaTemplate,
} from "@/types/quota";
import { ResourcePool } from "@/types/resource";
import useSWR, { mutate } from "swr";
import {
  assignTemplateToNamespaces,
  createNamespaceQuota,
  createNamespaceQuotaTemplate,
  createProjectQuota,
  createProjectQuotaInternal,
  getNamespaceQuotasByProjectId,
  getNamespaceQuotaTemplatesByProjectId,
  getOrgQuotasByOrgId,
  getProjectQuotasByProjectId,
} from "@/api/quota";
import { useParams } from "next/navigation";
import ProjectQuotaManager from "@/components/project-quota-manager";
import { getResourcePoolsByOrgId } from "@/api/resource";
import { Tabs, Tab } from "@heroui/tabs";
import NamespaceQuotaList from "@/components/namespace-quota-list";
import NamespaceQuotaForm from "@/components/namespace-quota-form";
import NamespaceQuotaTemplateForm from "@/components/namespace-quota-template-form";
import NamespaceQuotaTemplateAssign from "@/components/namespace-quota-template-assign";
import { getNamespaceByProjectId } from "@/api/namespace";
import { Namespace } from "@/types/namespace";
import { useState } from "react";

const ProjectQuotasPage = () => {
  const params = useParams();
  const { orgId, projectId } = params as { orgId: string; projectId: string };
  const [isQuotaFormOpen, setIsQuotaFormOpen] = useState(false);
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);

  const resourcePoolsData = useSWR(
    ["resource-pools", orgId],
    () => getResourcePoolsByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  const organizationQuotasData = useSWR(
    ["org-quotas"],
    () => getOrgQuotasByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  const projectQuotasData = useSWR(
    ["project-quotas", projectId],
    () => getProjectQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  const namespaceQuotasByProjectIdData = useSWR(
    ["namespace-quotas", projectId],
    () => getNamespaceQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  const namespaceQuotaTemplatesByProjectIdData = useSWR(
    ["namespace-quota-templates", projectId],
    () => getNamespaceQuotaTemplatesByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );
  const namespacesData = useSWR(
    ["namespaces", projectId],
    () => getNamespaceByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const orgQuotas: OrganizationQuota[] = organizationQuotasData.data || [];
  const resourcePools: ResourcePool[] = resourcePoolsData.data || [];
  const projectQuotas: ProjectQuota[] = projectQuotasData.data || [];
  const namespaceQuotasByProjectId: NamespaceQuota[] =
    namespaceQuotasByProjectIdData.data || [];
  const templates: NamespaceQuotaTemplate[] = namespaceQuotaTemplatesByProjectIdData.data || [];
  const namespaces: Namespace[] = namespacesData.data || [];

  const handleCreateProjectQuota = async (data: CreateProjectQuotaDTO) => {
    try {
      await createProjectQuota(data);
      await mutate(["project-quotas", data.project_id], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating project quota:", error);
    }
  };

  const handleCreateProjectQuotaInternal = async (
    data: CreateProjectQuotaInternalDTO
  ) => {
    try {
      await createProjectQuotaInternal(data);
      await mutate(["project-quotas", data.project_id], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating project quota internal:", error);
    }
  };

  const handleCreateNamespaceQuota = async (data: CreateNamespaceQuotaDTO) => {
    try {
      await createNamespaceQuota(data);
      await mutate(["namespace-quotas", projectId], undefined, {
        revalidate: true,
      });
      setIsQuotaFormOpen(false);
    } catch (error) {
      console.error("Error creating namespace quota:", error);
    }
  };

  const handleCreateQuotaTemplate = async (data: CreateQuotaTemplateDTO) => {
    try {
      await createNamespaceQuotaTemplate(data);
      await mutate(["namespace-quota-templates", projectId], undefined, {
        revalidate: true,
      });
      setIsTemplateFormOpen(false);
    } catch (error) {
      console.error("Error creating namespace quota template:", error);
    }
  };

  const handleAssignTemplate = async (data: AssignTemplateToNamespacesDTO) => {
    try {
      await assignTemplateToNamespaces(data);
      await mutate(["namespace-quota-templates", projectId], undefined, {
        revalidate: true,
      });
      setIsAssignFormOpen(false);
    } catch (error) {
      console.error("Error assigning template to namespaces:", error);
    }
  };

  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Quota Management
        </h1>
      </div>

      <Tabs aria-label="Quota management sections" size="lg">
        <Tab key="project" title="Project Quotas">
          <Card>
            <CardBody className="p-4">
              <ProjectQuotaManager
                orgId={orgId}
                projectId={projectId}
                projectQuotas={projectQuotas}
                orgQuotas={orgQuotas}
                resourcePools={resourcePools}
                onCreateQuota={handleCreateProjectQuota}
                onCreateQuotaInternal={handleCreateProjectQuotaInternal}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="namespace" title="Namespace Quotas">
          <Card>
            <CardBody className="p-4">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Namespace Quotas</h2>
                <NamespaceQuotaList
                  quotas={namespaceQuotasByProjectId}
                  onCreateClick={() => setIsQuotaFormOpen(true)}
                />
              </div>
            </CardBody>
          </Card>

          <NamespaceQuotaForm
            isOpen={isQuotaFormOpen}
            onClose={() => setIsQuotaFormOpen(false)}
            onSubmit={handleCreateNamespaceQuota}
            projectQuotas={projectQuotas}
          />
        </Tab>

        <Tab key="templates" title="Quota Templates">
          <Card>
            <CardBody className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quota Templates</h2>
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
                          <span className="text-gray-500">Resources:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {template.quotas?.flatMap((quota) =>
                              quota.resources?.map((r) => (
                                <span
                                  key={r.id}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
                                >
                                  {r.resource_prop.resource.name}: {r.quantity}
                                </span>
                              ))
                            ) || (
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
            onSubmit={handleCreateQuotaTemplate}
            namespaceQuotas={namespaceQuotasByProjectId}
            projectId={projectId}
          />

          <NamespaceQuotaTemplateAssign
            isOpen={isAssignFormOpen}
            onClose={() => setIsAssignFormOpen(false)}
            onSubmit={handleAssignTemplate}
            templates={templates}
            projectId={projectId}
            namespaces={namespaces}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProjectQuotasPage;
