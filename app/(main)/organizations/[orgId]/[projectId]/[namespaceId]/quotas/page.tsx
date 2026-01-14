"use client";

import NamespaceQuotaManager from "@/components/namespace-quota-manager";
import {
  AssignTemplateToNamespacesDTO,
  CreateNamespaceQuotaDTO,
  CreateQuotaTemplateDTO,
  NamespaceQuota,
  ProjectQuota,
} from "@/types/quota";
import { CardBody, Card } from "@heroui/card";
import useSWR, { mutate } from "swr";
import { useParams } from "next/navigation";
import {
  assignTemplateToNamespaces,
  createNamespaceQuota,
  createNamespaceQuotaTemplate,
  getNamespaceQuotasByNamespaceId,
  getNamespaceQuotasByProjectId,
  getNamespaceQuotaTemplatesByProjectId,
  getProjectQuotasByProjectId,
} from "@/api/quota";
import { getNamespaceByProjectId } from "@/api/namespace";

const NamespaceQuotasPage = () => {
  const params = useParams();
  const { projectId, namespaceId } = params as {
    projectId: string;
    namespaceId: string;
  };

  const projectQuotasData = useSWR(
    ["project-quotas", projectId],
    () => getProjectQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const namespaceQuotasByNamespaceId = useSWR(
    ["namespace-quotas", namespaceId],
    () => getNamespaceQuotasByNamespaceId(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const namespaceQuotasByProjectIdData = useSWR(
    ["namespace-quotas", projectId],
    () => getNamespaceQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const namespaceQuotaTemplatesByProjectIdData = useSWR(
    ["namespace-quota-templates", projectId],
    () => getNamespaceQuotaTemplatesByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const namespacesData = useSWR(
    ["namespaces", projectId],
    () => getNamespaceByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const projectQuotas: ProjectQuota[] = projectQuotasData.data || [];
  const namespaceQuotasByProjectId: NamespaceQuota[] = namespaceQuotasByProjectIdData.data || [];
  const namespaceQuotasByNamespace: NamespaceQuota[] = namespaceQuotasByNamespaceId.data || [];
  const templates = namespaceQuotaTemplatesByProjectIdData.data || [];
  const namespaces = namespacesData.data || [];

  console.log("templates:", templates);

  const handleCreateNamespaceQuota = async (data: CreateNamespaceQuotaDTO) => {
    try {
      await createNamespaceQuota(data);
      await mutate(["namespace-quotas", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating namespace quota:", error);
    } finally {
      // setIsOrgFormOpen(false);
    }
  };

  const handleCreateQuotaTemplate = async (data: CreateQuotaTemplateDTO) => {
    try {
      await createNamespaceQuotaTemplate(data);
      await mutate(["namespace-quota-templates", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating namespace quota template:", error);
    } finally {
      // setIsOrgFormOpen(false);
    }
  };

  const handleAssignTemplate = async (data: AssignTemplateToNamespacesDTO) => {
    try {
      await assignTemplateToNamespaces(data);
      await mutate(["namespace-quota-templates"], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error assigning template to namespaces:", error);
    } finally {
      // setIsOrgFormOpen(false);
    }
  };
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Quota Management
        </h1>
      </div>
      <Card>
        <CardBody className="p-4">
          <NamespaceQuotaManager
            onCreateQuota={handleCreateNamespaceQuota}
            onCreateTemplate={handleCreateQuotaTemplate}
            onAssignTemplate={handleAssignTemplate}
            namespaceQuotasByProject={namespaceQuotasByProjectId}
            namespaceQuotasByNamespace={namespaceQuotasByNamespace}
            projectQuotas={projectQuotas}
            templates={templates}
            projectId={projectId}
            namespaces={namespaces}
          />
        </CardBody>
      </Card>
    </div>
  );
};
export default NamespaceQuotasPage;
