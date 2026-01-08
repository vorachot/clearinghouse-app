"use client";

import { Card, CardBody } from "@heroui/card";
import {
  OrganizationQuota,
  ProjectQuota,
  CreateProjectQuotaDTO,
  CreateProjectQuotaInternalDTO,
} from "@/types/quota";
import { ResourcePool } from "@/types/resource";
import useSWR, { mutate } from "swr";
import {
  createProjectQuota,
  createProjectQuotaInternal,
  getOrgQuotasByOrgId,
  getProjectQuotasByProjectId,
} from "@/api/quota";
import { useParams } from "next/navigation";
import ProjectQuotaManager from "@/components/project-quota-manager";
import { getResourcePoolsByOrgId } from "@/api/resource";

const ProjectQuotasPage = () => {
  const params = useParams();
  const { orgId, projectId } = params as { orgId: string; projectId: string };

  const resourcePoolsData = useSWR(
    ["resource-pools", orgId],
    () => getResourcePoolsByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const organizationQuotasData = useSWR(
    ["org-quotas"],
    () => getOrgQuotasByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const projectQuotasData = useSWR(
    ["project-quotas", projectId],
    () => getProjectQuotasByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );

  const orgQuotas: OrganizationQuota[] = organizationQuotasData.data || [];
  const resourcePools: ResourcePool[] = resourcePoolsData.data || [];
  const projectQuotas: ProjectQuota[] = projectQuotasData.data || [];

  const handleCreateProjectQuota = async (data: CreateProjectQuotaDTO) => {
    try {
      await createProjectQuota(data);
      await mutate(["project-quotas", data.project_id], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating project quota:", error);
    } finally {
      // setIsOrgFormOpen(false);
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
    </div>
  );
};

export default ProjectQuotasPage;
