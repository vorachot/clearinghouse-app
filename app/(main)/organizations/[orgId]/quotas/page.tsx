"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import OrganizationQuotaList from "@/components/org-quota-list";
import OrganizationQuotaForm from "@/components/org-quota-form";
import OrganizationQuotaDetail from "@/components/org-quota-detail";
import { OrganizationQuota, CreateOrganizationQuotaDTO } from "@/types/quota";
import { Organization } from "@/types/org";
import useSWR, { mutate } from "swr";
import { getOrganizations } from "@/api/org";
import {
  createOrgQuota,
  getOrgQuotasByOrgId,
  deleteOrgQuota,
} from "@/api/quota";
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
    },
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

  const handleDeleteOrgQuota = async (quotaId: string) => {
    try {
      await deleteOrgQuota(quotaId);
      await mutate(["org-quotas"], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Failed to delete organization quota:", error);
      throw error;
    }
  };

  const allocatedQuotas = orgQuotas.filter(
    (q) => q.from_organization_id === orgId,
  );
  const receivedQuotas = orgQuotas.filter(
    (q) => q.to_organization_id === orgId,
  );

  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Quota Management
        </h1>
      </div>

      {/* Quotas Allocated by This Organization */}
      <Card>
        <CardBody className="p-4">
          <OrganizationQuotaList
            quotas={allocatedQuotas}
            onCreateClick={() => setIsOrgFormOpen(true)}
            onViewDetails={handleViewOrgQuotaDetails}
            onDelete={handleDeleteOrgQuota}
          />
        </CardBody>
      </Card>

      {/* Quotas Received by This Organization */}
      <Card>
        <CardBody className="p-4">
          <OrganizationQuotaList
            quotas={receivedQuotas}
            onCreateClick={() => {}} // No create button for received quotas
            onViewDetails={handleViewOrgQuotaDetails}
            hideCreateButton={true}
          />
        </CardBody>
      </Card>

      <OrganizationQuotaForm
        isOpen={isOrgFormOpen}
        onClose={() => setIsOrgFormOpen(false)}
        onSubmit={handleCreateOrgQuota}
        organizations={organizations}
        orgId={orgId}
      />

      <OrganizationQuotaDetail
        quota={selectedOrgQuota}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

export default OrgQuotasPage;
