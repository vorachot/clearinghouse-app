"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  StyleRounded,
  FolderOpenRounded,
  VisibilityRounded,
  EditRounded,
} from "@mui/icons-material";
import { Chip } from "@heroui/chip";
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
  UpdateQuotaTemplateDTO,
} from "@/types/quota";
import { ResourcePool } from "@/types/resource";
import useSWR, { mutate } from "swr";
import {
  assignTemplateToNamespaces,
  createNamespaceQuota,
  createNamespaceQuotaTemplate,
  createProjectQuota,
  createProjectQuotaInternal,
  deleteProjectQuota,
  deleteNamespaceQuota,
  deleteNamespaceQuotaTemplate,
  getNamespaceQuotasByProjectId,
  getNamespaceQuotaTemplatesByProjectId,
  getOrgQuotasByOrgId,
  getProjectQuotasByProjectId,
  updateNamespaceQuotaTemplate,
} from "@/api/quota";
import { useParams } from "next/navigation";
import ProjectQuotaManager from "@/components/project-quota-manager";
import { getResourcePoolsByOrgId } from "@/api/resource";
import { Tabs, Tab } from "@heroui/tabs";
import NamespaceQuotaList from "@/components/namespace-quota-list";
import NamespaceQuotaForm from "@/components/namespace-quota-form";
import NamespaceQuotaTemplateForm from "@/components/namespace-quota-template-form";
import NamespaceQuotaTemplateAssign from "@/components/namespace-quota-template-assign";
import DeleteNamespaceQuotaTemplateDialog from "@/components/delete-namespace-quota-template-dialog";
import ViewTemplateDialog from "@/components/view-template-dialog";
import EditQuotaTemplateDialog from "@/components/edit-quota-template-dialog";
import { getNamespaceByProjectId } from "@/api/namespace";
import { Namespace } from "@/types/namespace";

const ProjectQuotasPage = () => {
  const params = useParams();
  const { orgId, projectId } = params as { orgId: string; projectId: string };
  const [isQuotaFormOpen, setIsQuotaFormOpen] = useState(false);
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  const [isAssignFormOpen, setIsAssignFormOpen] = useState(false);
  const [deleteTemplateDialogOpen, setDeleteTemplateDialogOpen] =
    useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [viewingTemplate, setViewingTemplate] =
    useState<NamespaceQuotaTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] =
    useState<NamespaceQuotaTemplate | null>(null);

  const resourcePoolsData = useSWR(
    ["resource-pools", orgId],
    () => getResourcePoolsByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const organizationQuotasData = useSWR(
    ["org-quotas"],
    () => getOrgQuotasByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const projectQuotasData = useSWR(
    ["project-quotas", projectId],
    () => getProjectQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const namespaceQuotasByProjectIdData = useSWR(
    ["namespace-quotas", projectId],
    () => getNamespaceQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const namespaceQuotaTemplatesByProjectIdData = useSWR(
    ["namespace-quota-templates", projectId],
    () => getNamespaceQuotaTemplatesByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const namespacesData = useSWR(
    ["namespaces", projectId],
    () => getNamespaceByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  const orgQuotas: OrganizationQuota[] = organizationQuotasData.data || [];
  const resourcePools: ResourcePool[] = resourcePoolsData.data || [];
  const projectQuotas: ProjectQuota[] = projectQuotasData.data || [];
  const namespaceQuotasByProjectId: NamespaceQuota[] =
    namespaceQuotasByProjectIdData.data || [];
  const templates: NamespaceQuotaTemplate[] =
    namespaceQuotaTemplatesByProjectIdData.data || [];
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
    data: CreateProjectQuotaInternalDTO,
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

  const handleDeleteProjectQuota = async (quotaId: string) => {
    try {
      await deleteProjectQuota(quotaId);
      await mutate(["project-quotas", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Failed to delete project quota:", error);
      throw error;
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

  const handleDeleteNamespaceQuota = async (quotaId: string) => {
    try {
      await deleteNamespaceQuota(quotaId);
      await mutate(["namespace-quotas", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Failed to delete namespace quota:", error);
      throw error;
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

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    setSelectedTemplateId(templateId);
    setSelectedTemplateName(templateName);
    setDeleteTemplateDialogOpen(true);
    setTemplateError(null);
  };

  const handleConfirmDeleteTemplate = async () => {
    if (selectedTemplateId) {
      setIsDeletingTemplate(true);
      try {
        await deleteNamespaceQuotaTemplate(selectedTemplateId);
        await mutate(["namespace-quota-templates", projectId], undefined, {
          revalidate: true,
        });
        setDeleteTemplateDialogOpen(false);
      } catch (error: any) {
        console.error("Error deleting template:", error);
        setTemplateError(
          error.response?.data?.error || "Failed to delete template",
        );
      } finally {
        setIsDeletingTemplate(false);
      }
    }
  };

  const handleUpdateTemplate = async (
    templateId: string,
    data: UpdateQuotaTemplateDTO,
  ) => {
    try {
      await updateNamespaceQuotaTemplate(templateId, data);
      await mutate(["namespace-quota-templates", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
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
                onDeleteQuota={handleDeleteProjectQuota}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="namespace" title="Namespace Quotas">
          <Card>
            <CardBody className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Namespace Quotas</h2>
                  <Button
                    color="primary"
                    startContent={<AddIcon />}
                    onPress={() => setIsQuotaFormOpen(true)}
                    size="sm"
                  >
                    Create Namespace Quota
                  </Button>
                </div>
                <NamespaceQuotaList
                  quotas={namespaceQuotasByProjectId}
                  onDelete={handleDeleteNamespaceQuota}
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
                  <Button
                    color="primary"
                    startContent={<AddIcon />}
                    onPress={() => setIsTemplateFormOpen(true)}
                    size="sm"
                  >
                    Create Template
                  </Button>
                  <Button
                    color="secondary"
                    startContent={<AddIcon />}
                    onPress={() => setIsAssignFormOpen(true)}
                    size="sm"
                  >
                    Assign Template
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => {
                  // Find namespaces using this template
                  const namespacesUsingTemplate = namespaces.filter(
                    (ns) => ns.quota_template_id === template.id,
                  );

                  return (
                    <Card key={template.id} className="border">
                      <CardBody>
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                              <StyleRounded className="!w-5 !h-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h4 className="font-semibold text-lg">
                              {template.name}
                            </h4>
                          </div>
                          <div className="flex gap-1">
                            <Tooltip content="View details">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                color="primary"
                                onPress={() => setViewingTemplate(template)}
                              >
                                <VisibilityRounded className="!w-4 !h-4" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Edit template">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                color="warning"
                                onPress={() => setEditingTemplate(template)}
                              >
                                <EditRounded className="!w-4 !h-4" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Delete template" color="danger">
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                color="danger"
                                onPress={() =>
                                  handleDeleteTemplate(
                                    template.id,
                                    template.name,
                                  )
                                }
                              >
                                <DeleteIcon className="!w-4 !h-4" />
                              </Button>
                            </Tooltip>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">
                          {template.description}
                        </p>
                        <div className="space-y-3">
                          <div className="text-xs">
                            <span className="text-gray-500 font-medium">
                              Resources:
                            </span>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(() => {
                                // Group resources by resource type name and sum quantities
                                const aggregatedResources = new Map<
                                  string,
                                  number
                                >();

                                template.quotas?.forEach((quota) => {
                                  quota.resources?.forEach((r) => {
                                    const resourceTypeName =
                                      r.resource_prop?.resource?.resource_type
                                        ?.name || "Unknown";

                                    const current =
                                      aggregatedResources.get(
                                        resourceTypeName,
                                      ) || 0;
                                    aggregatedResources.set(
                                      resourceTypeName,
                                      current + r.quantity,
                                    );
                                  });
                                });

                                if (aggregatedResources.size === 0) {
                                  return (
                                    <span className="text-gray-500 text-xs">
                                      No resources
                                    </span>
                                  );
                                }

                                return Array.from(
                                  aggregatedResources.entries(),
                                ).map(([typeName, totalQuantity]) => (
                                  <Chip
                                    key={typeName}
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    className="text-xs"
                                  >
                                    {typeName}: {totalQuantity}
                                  </Chip>
                                ));
                              })()}
                            </div>
                          </div>
                          <div className="text-xs">
                            <span className="text-gray-500 font-medium">
                              Used by namespaces:
                            </span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {namespacesUsingTemplate.length > 0 ? (
                                namespacesUsingTemplate.map((ns) => (
                                  <Chip
                                    key={ns.id}
                                    size="sm"
                                    variant="flat"
                                    color="success"
                                    className="text-xs"
                                    startContent={
                                      <FolderOpenRounded className="!w-3 !h-3" />
                                    }
                                  >
                                    {ns.name}
                                  </Chip>
                                ))
                              ) : (
                                <span className="text-gray-500 text-xs">
                                  Not assigned to any namespace
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
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
      <DeleteNamespaceQuotaTemplateDialog
        isOpen={deleteTemplateDialogOpen}
        templateName={selectedTemplateName}
        onClose={() => setDeleteTemplateDialogOpen(false)}
        onConfirm={handleConfirmDeleteTemplate}
        isDeleting={isDeletingTemplate}
        error={templateError}
      />
      <ViewTemplateDialog
        isOpen={!!viewingTemplate}
        onClose={() => setViewingTemplate(null)}
        template={viewingTemplate}
      />
      <EditQuotaTemplateDialog
        isOpen={!!editingTemplate}
        onClose={() => setEditingTemplate(null)}
        onSubmit={handleUpdateTemplate}
        template={editingTemplate}
        namespaceQuotas={namespaceQuotasByProjectId}
      />
    </div>
  );
};

export default ProjectQuotasPage;
