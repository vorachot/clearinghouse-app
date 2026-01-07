"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { OrganizationQuota } from "@/types/quota";

type OrganizationQuotaDetailProps = {
  quota: OrganizationQuota | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function OrganizationQuotaDetail({
  quota,
  isOpen,
  onClose,
}: OrganizationQuotaDetailProps) {
  if (!quota) return null;

  const formatDuration = (seconds: number) => {
    if (seconds < 3600) {
      return `${seconds / 60} min`;
    }
    return `${seconds / 3600} hr`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div>
            <h2 className="text-2xl font-bold">{quota.name}</h2>
            <p className="text-sm text-gray-500 font-normal">
              {quota.description}
            </p>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Organizations */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Organizations</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">FROM</p>
                      <p className="font-semibold">
                        {quota.from_organization?.name ||
                          quota.from_organization_id}
                      </p>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div>
                      <p className="text-xs text-gray-500">TO</p>
                      <p className="font-semibold">
                        {quota.to_organization?.name ||
                          quota.to_organization_id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Resources Breakdown */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Resources</h3>
              </CardHeader>
              <CardBody>
                <Table aria-label="Resources breakdown">
                  <TableHeader>
                    <TableColumn>RESOURCE TYPE</TableColumn>
                    <TableColumn>QUANTITY</TableColumn>
                    <TableColumn>DURATION</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {quota.resources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <p className="font-semibold">
                            {resource.resource_prop.resource.resource_type
                              .name ||
                              resource.resource_prop.resource.resource_type.id}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            {resource.quantity}{" "}
                            {resource.resource_prop.resource.resource_type.unit}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDuration(resource.resource_prop.max_duration)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Details</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Quota ID</p>
                    <p className="font-mono text-sm">{quota.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Node ID</p>
                    <p className="font-mono text-sm">{quota.node_id}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
