"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import ProjectQuotaList from "./project-quota-list";
import ProjectQuotaExternalForm from "./project-quota-external-form";
import ProjectQuotaInternalForm from "./project-quota-internal-form";
import { ProjectQuota, CreateProjectQuotaDTO, CreateProjectQuotaInternalDTO } from "@/types/quota";
import { ResourcePool } from "@/types/resource";
import { OrganizationQuota } from "@/types/quota";

type ProjectQuotaManagerProps = {
  orgId: string;
  projectId: string;
  projectQuotas: ProjectQuota[];
  resourcePools: ResourcePool[];
  orgQuotas: OrganizationQuota[];
  onCreateQuota: (data: CreateProjectQuotaDTO) => void;
  onCreateQuotaInternal: (data: CreateProjectQuotaInternalDTO) => void;
};

export default function ProjectQuotaManager({
  orgId,
  projectId,
  projectQuotas,
  orgQuotas,
  resourcePools,
  onCreateQuota,
  onCreateQuotaInternal,
}: ProjectQuotaManagerProps) {
  const [isExternalFormOpen, setIsExternalFormOpen] = useState(false);
  const [isInternalFormOpen, setIsInternalFormOpen] = useState(false);

  // const externalQuotas = projectQuotas.filter(
  //   (q) => q.source === "organization_quota"
  // );
  // const internalQuotas = projectQuotas.filter(
  //   (q) => q.source === "resource_pool"
  // );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Quotas</h2>

      <Tabs aria-label="Project quota types">
        <Tab key="external" title="External (from Org Quota)">
          <Card>
            <CardBody className="p-4">
              <ProjectQuotaList
                quotas={projectQuotas.filter(
                  (q) => q.organization_quota_id !== null
                )}
                onCreateClick={() => setIsExternalFormOpen(true)}
                type="external"
              />
            </CardBody>
          </Card>

          <ProjectQuotaExternalForm
            isOpen={isExternalFormOpen}
            onClose={() => setIsExternalFormOpen(false)}
            onSubmit={(data) => {
              onCreateQuota(data);
              setIsExternalFormOpen(false);
            }}
            
            orgQuotas={orgQuotas.filter((quota) => orgId === quota.to_organization_id)}
            projectId={projectId}
          />
        </Tab>

        <Tab key="internal" title="Internal (from Resource Pool)">
          <Card>
            <CardBody className="p-4">
              <ProjectQuotaList
                quotas={projectQuotas.filter(
                  (q) => q.organization_quota_id === null
                )}
                onCreateClick={() => setIsInternalFormOpen(true)}
                type="internal"
              />
            </CardBody>
          </Card>

          <ProjectQuotaInternalForm
            isOpen={isInternalFormOpen}
            onClose={() => setIsInternalFormOpen(false)}
            onSubmit={(data) => {
              onCreateQuotaInternal(data);
              setIsInternalFormOpen(false);
            }}
            resourcePools={resourcePools}
            projectId={projectId}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
