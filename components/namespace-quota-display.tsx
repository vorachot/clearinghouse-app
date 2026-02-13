"use client";

import { Card, CardBody } from "@heroui/card";
import { NamespaceQuota, NamespaceQuotaTemplate } from "@/types/quota";
import useSWR from "swr";
import {
  getNamespaceQuotasByNamespaceId,
  getQuotaUsageByNamespaceId,
} from "@/api/quota";
import UsageBar from "./usagebar";
import { useState, useEffect } from "react";
import { StyleRounded, LinkOffRounded } from "@mui/icons-material";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Chip } from "@heroui/chip";
import LayersIcon from "@mui/icons-material/Layers";

type NamespaceQuotaDisplayProps = {
  namespaceId: string;
  namespaceTemplate?: NamespaceQuotaTemplate;
  onUnassignTemplate?: () => void;
};

// Helper function to get color based on resource type
const getResourceTypeColor = (resourceTypeName: string) => {
  const lowerTypeName = resourceTypeName.toLowerCase();
  if (lowerTypeName.includes("cpu")) return "primary";
  if (lowerTypeName.includes("gpu")) return "secondary";
  if (lowerTypeName.includes("ram") || lowerTypeName.includes("memory"))
    return "success";
  return "default";
};

export default function NamespaceQuotaDisplay({
  namespaceId,
  namespaceTemplate,
  onUnassignTemplate,
}: NamespaceQuotaDisplayProps) {
  const namespaceQuotasByNamespaceId = useSWR(
    ["namespace-quotas", namespaceId],
    () => getNamespaceQuotasByNamespaceId(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );

  const namespaceQuotas: NamespaceQuota[] =
    namespaceQuotasByNamespaceId.data || [];
  const [quotaUsages, setQuotaUsages] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchUsages = async () => {
      const usages: Record<string, any> = {};
      for (const quota of namespaceQuotas) {
        try {
          const usage = await getQuotaUsageByNamespaceId(quota.id, namespaceId);
          usages[quota.id] = usage;
        } catch (error) {
          console.error(`Error fetching usage for quota ${quota.id}:`, error);
        }
      }
      setQuotaUsages(usages);
    };

    if (namespaceQuotas.length > 0) {
      fetchUsages();
    }
  }, [namespaceQuotas, namespaceId]);

  if (namespaceQuotas.length === 0) {
    return (
      <Card>
        <CardBody className="p-6 text-center">
          <p className="text-gray-500">
            No quota template has been assigned to this namespace yet.
          </p>
          {/* <p className="text-sm text-gray-400 mt-2">
            Please ask a project administrator to assign a quota template to
            this namespace.
          </p> */}
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Resource Quotas</h2>
        {/* Template Info Section */}
        {namespaceTemplate && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <StyleRounded className="!w-4 !h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {namespaceTemplate.name}
            </span>
            {onUnassignTemplate && (
              <Tooltip content="Unassign template" color="secondary">
                <Button
                  isIconOnly
                  size="sm"
                  color="secondary"
                  variant="light"
                  onPress={onUnassignTemplate}
                  className="ml-1"
                >
                  <LinkOffRounded className="!w-4 !h-4" />
                </Button>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {namespaceQuotas.map((quota) => {
          const usage = quotaUsages[quota.id];

          // Get resources from quota
          const resources = quota.resources || [];

          return (
            <Card key={quota.id} className="border">
              <CardBody className="p-6">
                <div className="space-y-6">
                  {/* Quota Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <LayersIcon
                        className="text-secondary"
                        fontSize="medium"
                      />
                      <h3 className="text-lg font-semibold">
                        {quota.name || "Namespace Quota"}
                      </h3>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {quota?.node_name && (
                        <Chip size="sm" variant="flat" color="primary">
                          {quota.node_name}
                        </Chip>
                      )}
                      {quota?.organization_name && (
                        <Chip size="sm" variant="flat" color="secondary">
                          {quota.organization_name}
                        </Chip>
                      )}
                      {!quota?.node_name && !quota?.organization_name && (
                        <Chip size="sm" variant="flat" color="default">
                          Namespace Quota
                        </Chip>
                      )}
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="space-y-4">
                    {resources.map((resource: any) => {
                      const resourceTypeId =
                        resource?.resource_prop?.resource?.resource_type_id;

                      // Find matching usage data by type_id
                      const matchingUsage = usage?.type?.find(
                        (usageType: any) =>
                          usageType.type_id === resourceTypeId,
                      );

                      const usedAmount = matchingUsage?.used || 0;
                      const totalAmount = resource.quantity || 0;
                      const resourceTypeName =
                        resource?.resource_prop?.resource?.resource_type
                          ?.name || "";
                      const unit =
                        resource?.resource_prop?.resource?.resource_type
                          ?.unit || "units";
                      const nodeName =
                        resource?.resource_prop?.resource?.node?.name;

                      const resourceTypeColor =
                        getResourceTypeColor(resourceTypeName);
                      const usagePercentage =
                        totalAmount > 0
                          ? ((usedAmount / totalAmount) * 100).toFixed(1)
                          : 0;

                      return (
                        <div
                          key={`${quota.id}-${resourceTypeId}`}
                          className="p-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Chip
                                  color={resourceTypeColor}
                                  variant="flat"
                                  size="lg"
                                  className="font-semibold text-base"
                                >
                                  {resourceTypeName}
                                </Chip>
                                {nodeName && (
                                  <Chip
                                    size="sm"
                                    variant="bordered"
                                    color="default"
                                  >
                                    {nodeName}
                                  </Chip>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                  {usedAmount}
                                </span>
                                <span className="text-2xl text-gray-400 font-light">
                                  /
                                </span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                  {totalAmount}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium text-gray-500">
                                  {unit}
                                </span>
                                {/* <span className="text-gray-400">•</span>
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                  {usagePercentage}% used
                                </span> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
