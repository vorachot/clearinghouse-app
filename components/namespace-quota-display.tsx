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
import { StyleRounded } from "@mui/icons-material";

type NamespaceQuotaDisplayProps = {
  namespaceId: string;
  namespaceTemplate?: NamespaceQuotaTemplate;
};

export default function NamespaceQuotaDisplay({
  namespaceId,
  namespaceTemplate,
}: NamespaceQuotaDisplayProps) {
  const namespaceQuotasByNamespaceId = useSWR(
    ["namespace-quotas", namespaceId],
    () => getNamespaceQuotasByNamespaceId(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <StyleRounded className="!w-4 !h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {namespaceTemplate.name}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {namespaceQuotas.map((quota) => {
          const usage = quotaUsages[quota.id];

          // Get resources from quota
          const resources = quota.resources || [];

          // Build quota source info
          const quotaSourceParts = [];
          if (quota?.node_name)
            quotaSourceParts.push(`Node: ${quota.node_name}`);
          if (quota?.organization_name)
            quotaSourceParts.push(`Org: ${quota.organization_name}`);

          const quotaSource =
            quotaSourceParts.length > 0
              ? quotaSourceParts.join(" • ")
              : "Namespace Quota";

          return (
            <Card key={quota.id} className="border">
              <CardBody className="p-6">
                <div className="space-y-6">
                  {/* Quota Header */}
                  <div className="border-b pb-3">
                    <h3 className="text-lg font-semibold mb-1">
                      {quota.name || "Namespace Quota"}
                    </h3>
                    <p className="text-sm text-gray-500">{quotaSource}</p>
                  </div>

                  {/* Resources */}
                  <div className="space-y-4">
                    {resources.map((resource: any) => {
                      const resourceTypeId =
                        resource?.resource_prop?.resource?.resource_type_id;

                      // Find matching usage data by type_id
                      const matchingUsage = usage?.type?.find(
                        (usageType: any) => usageType.type_id === resourceTypeId
                      );

                      const usedAmount = matchingUsage?.used || 0;
                      const totalAmount = resource.quantity || 0;
                      const resourceName =
                        resource?.resource_prop?.resource?.name ||
                        "Unknown Resource";
                      const resourceTypeName =
                        resource?.resource_prop?.resource?.resource_type
                          ?.name || "";
                      const unit =
                        resource?.resource_prop?.resource?.resource_type
                          ?.unit || "units";
                      const nodeName =
                        resource?.resource_prop?.resource?.node?.name;

                      return (
                        <div
                          key={`${quota.id}-${resourceTypeId}`}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">
                                {resourceName}
                                {resourceTypeName && (
                                  <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({resourceTypeName})
                                  </span>
                                )}
                              </h4>
                              {nodeName && (
                                <p className="text-xs text-gray-500">
                                  Node: {nodeName}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">
                                {usedAmount} / {totalAmount}
                              </div>
                              <div className="text-xs text-gray-500">
                                {unit}
                              </div>
                            </div>
                          </div>

                          {/* <UsageBar
                            value={usedAmount}
                            maxValue={totalAmount}
                            label={resourceName}
                          /> */}
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
