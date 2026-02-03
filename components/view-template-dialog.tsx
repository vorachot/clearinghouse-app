"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { NamespaceQuotaTemplate } from "@/types/quota";
import { StyleRounded } from "@mui/icons-material";
import LayersIcon from "@mui/icons-material/Layers";

type ViewTemplateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  template: NamespaceQuotaTemplate | null;
};

export default function ViewTemplateDialog({
  isOpen,
  onClose,
  template,
}: ViewTemplateDialogProps) {
  if (!template) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <StyleRounded className="!w-6 !h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{template.name}</h3>
              <p className="text-sm text-gray-500 font-normal">
                Template Details
              </p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Description */}
            {template.description && (
              <Card>
                <CardHeader>
                  <h4 className="text-md font-semibold">Description</h4>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Source Namespace Quotas */}
            <Card>
              <CardHeader>
                <h4 className="text-md font-semibold">
                  Source Namespace Quotas
                </h4>
              </CardHeader>
              <CardBody>
                {template.quotas && template.quotas.length > 0 ? (
                  <div className="space-y-3">
                    {template.quotas.map((quota) => (
                      <div key={quota.id} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <LayersIcon
                            className="text-secondary"
                            fontSize="small"
                          />
                          <p className="font-semibold">{quota.name}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 pl-8">
                          {quota.resources?.map((resource) => (
                            <Chip key={resource.id} size="sm" variant="flat">
                              {resource.resource_prop?.resource?.resource_type
                                ?.name || "Unknown"}
                              : {resource.quantity}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No source quotas found
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
