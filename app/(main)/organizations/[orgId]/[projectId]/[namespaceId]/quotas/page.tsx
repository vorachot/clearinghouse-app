"use client";

import { Card, CardBody } from "@heroui/card";
import { useParams } from "next/navigation";
import NamespaceQuotaDisplay from "@/components/namespace-quota-display";

const NamespaceQuotasPage = () => {
  const params = useParams();
  const { namespaceId } = params as {
    namespaceId: string;
  };

  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Namespace Quotas
        </h1>
      </div>

      <Card>
        <CardBody className="p-4">
          <NamespaceQuotaDisplay namespaceId={namespaceId} />
        </CardBody>
      </Card>
    </div>
  );
};

export default NamespaceQuotasPage;
