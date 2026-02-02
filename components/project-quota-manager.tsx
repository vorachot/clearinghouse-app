"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";
import ProjectQuotaList from "./project-quota-list";
import ProjectQuotaExternalForm from "./project-quota-external-form";
import ProjectQuotaInternalForm from "./project-quota-internal-form";
import {
  ProjectQuota,
  CreateProjectQuotaDTO,
  CreateProjectQuotaInternalDTO,
} from "@/types/quota";
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
  onDeleteQuota?: (quotaId: string) => void;
};

export default function ProjectQuotaManager({
  orgId,
  projectId,
  projectQuotas,
  orgQuotas,
  resourcePools,
  onCreateQuota,
  onCreateQuotaInternal,
  onDeleteQuota,
}: ProjectQuotaManagerProps) {
  const [isExternalFormOpen, setIsExternalFormOpen] = useState(false);
  const [isInternalFormOpen, setIsInternalFormOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("external");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Quotas</h2>
        <Button
          color="primary"
          startContent={<AddIcon />}
          onPress={() =>
            selectedTab === "external"
              ? setIsExternalFormOpen(true)
              : setIsInternalFormOpen(true)
          }
          size="sm"
        >
          Create {selectedTab === "external" ? "External" : "Internal"} Quota
        </Button>
      </div>

      <Tabs
        aria-label="Project quota types"
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
      >
        <Tab key="external" title="External (from Org Quota)">
          <ProjectQuotaList
            quotas={projectQuotas.filter(
              (q) => q.organization_quota_id !== null,
            )}
            onDelete={onDeleteQuota}
            type="external"
          />

          <ProjectQuotaExternalForm
            isOpen={isExternalFormOpen}
            onClose={() => setIsExternalFormOpen(false)}
            onSubmit={(data) => {
              onCreateQuota(data);
              setIsExternalFormOpen(false);
            }}
            orgQuotas={orgQuotas.filter(
              (quota) => orgId === quota.to_organization_id,
            )}
            projectId={projectId}
          />
        </Tab>

        <Tab key="internal" title="Internal (from Resource Pool)">
          <ProjectQuotaList
            quotas={projectQuotas.filter(
              (q) => q.organization_quota_id === null,
            )}
            onDelete={onDeleteQuota}
            type="internal"
          />

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
