"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { NamespaceQuota } from "@/types/quota";
import AddIcon from "@mui/icons-material/Add";
import LayersIcon from "@mui/icons-material/Layers";

type NamespaceQuotaListProps = {
  quotas: NamespaceQuota[];
  onCreateClick: () => void;
};

export default function NamespaceQuotaList({
  quotas,
  onCreateClick,
}: NamespaceQuotaListProps) {

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Namespace Quotas</h3>
        <Button
          color="primary"
          startContent={<AddIcon />}
          onPress={onCreateClick}
          size="sm"
        >
          Create Namespace Quota
        </Button>
      </div>

      {quotas.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-gray-500 text-center py-8">
              No namespace quotas found for this project
            </p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {quotas.map((quota) => (
            <Card key={quota.id} className="border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <LayersIcon className="text-secondary" fontSize="small" />
                    <span className="font-semibold">{quota.name}</span>
                  </div>
                  <Chip size="sm" variant="flat" color="primary">
                    {quota.resources.length} resources
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Organization:</span>
                      <span className="ml-2 font-medium">
                        {quota.organization_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Node:</span>
                      <span className="ml-2 font-medium">
                        {quota.node_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Resources:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {quota.resources.map((resource) => (
                          <Chip key={resource.id} size="sm" variant="flat">
                            {resource.resource_prop.resource.resource_type.name}
                            : {resource.quantity}{" "}
                            {resource.resource_prop.resource.resource_type.unit}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
