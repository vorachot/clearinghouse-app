"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import OrganizationQuotaList from "@/components/org-quota-list";
import OrganizationQuotaForm from "@/components/org-quota-form";
import OrganizationQuotaDetail from "@/components/org-quota-detail";
import {
  OrganizationQuota,
  CreateOrganizationQuotaDTO,
  CreateNamespaceQuotaDTO,
  CreateQuotaTemplateDTO,
  AssignTemplateToNamespacesDTO,
} from "@/types/quota";
import { Organization } from "@/types/org";
import useSWR, { mutate } from "swr";
import { getOrganizations } from "@/api/org";
import { createOrgQuota, getOrgQuotasByOrgId } from "@/api/quota";
import { useParams } from "next/navigation";

const OrgQuotasPage = () => {
  const params = useParams();
  const { orgId } = params as { orgId: string };

  const [isOrgFormOpen, setIsOrgFormOpen] = useState(false);
  const [selectedOrgQuota, setSelectedOrgQuota] =
    useState<OrganizationQuota | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const organizationsData = useSWR(["orgs"], () => getOrganizations(), {
    revalidateOnFocus: false,
    dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
  });
  const organizationQuotasData = useSWR(
    ["org-quotas"],
    () => getOrgQuotasByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );

  const organizations: Organization[] = organizationsData.data || [];
  const orgQuotas: OrganizationQuota[] = organizationQuotasData.data || [];

  const handleCreateOrgQuota = async (data: CreateOrganizationQuotaDTO) => {
    try {
      await createOrgQuota(data);
      await mutate(["org-quotas"], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating organization quota:", error);
    } finally {
      setIsOrgFormOpen(false);
    }
  };

  const handleViewOrgQuotaDetails = (quota: OrganizationQuota) => {
    setSelectedOrgQuota(quota);
    setIsDetailOpen(true);
  };

  const handleCreateNamespaceQuota = (data: CreateNamespaceQuotaDTO) => {
    console.log("Creating namespace quota:", data);
    // TODO: Implement API call
  };

  const handleCreateQuotaTemplate = (data: CreateQuotaTemplateDTO) => {
    console.log("Creating quota template:", data);
    // TODO: Implement API call
  };

  const handleAssignTemplate = (data: AssignTemplateToNamespacesDTO) => {
    console.log("Assigning template:", data);
    // TODO: Implement API call
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
          <OrganizationQuotaList
            quotas={orgQuotas.filter((q) => q.from_organization_id === orgId)}
            onCreateClick={() => setIsOrgFormOpen(true)}
            onViewDetails={handleViewOrgQuotaDetails}
          />
        </CardBody>
      </Card>

      <OrganizationQuotaForm
        isOpen={isOrgFormOpen}
        onClose={() => setIsOrgFormOpen(false)}
        onSubmit={handleCreateOrgQuota}
        organizations={organizations}
      />

      <OrganizationQuotaDetail
        quota={selectedOrgQuota}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      {/* <Tabs aria-label="Quota management levels" color="primary" size="lg">
        <Tab key="organization" title="Organization Quotas"></Tab>

        <Tab key="project" title="Project Quotas">
          <Card>
            <CardBody className="p-4">
              <ProjectQuotaManager
                projectQuotas={projectQuotas}
                organizations={organizations}
                projects={mockProjects}
                orgQuotas={orgQuotas}
                resourcePools={mockResourcePools}
                nodes={mockNodes}
                resourceTypes={mockResourceTypes}
                onCreateQuota={handleCreateProjectQuota}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab key="namespace" title="Namespace Quotas">
          <Card>
            <CardBody className="p-4">
              <NamespaceQuotaManager
                namespaceQuotas={namespaceQuotas}
                templates={quotaTemplates}
                projects={mockProjects}
                projectQuotas={projectQuotas}
                namespaces={mockNamespaces}
                nodes={mockNodes}
                resourceTypes={mockResourceTypes}
                onCreateQuota={handleCreateNamespaceQuota}
                onCreateTemplate={handleCreateQuotaTemplate}
                onAssignTemplate={handleAssignTemplate}
              />
            </CardBody>
          </Card>
        </Tab>
      </Tabs> */}
    </div>
  );
};

export default OrgQuotasPage;
