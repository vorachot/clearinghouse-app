"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import AddIcon from "@mui/icons-material/Add";
import useSWR, { mutate } from "swr";
import { createResource, getResourceType } from "@/api/resource";
import { ResourceType } from "@/types/resource";

interface AddResourceDialogProps {
  nodeId: string;
  nodeName: string;
  orgId?: string;
}

export default function AddResourceDialog({
  nodeId,
  nodeName,
  orgId,
}: AddResourceDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [resourceType, setResourceType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resourceTypesData = useSWR(
    ["resourceTypes"],
    () => getResourceType(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const resourceTypes: ResourceType[] = resourceTypesData.data || [];

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const data = {
      resource_node_id: nodeId,
      resource_type_id: resourceType,
      quantity: parseInt(quantity, 10),
      name: name,
    };

    try {
      await createResource(data);
      onOpenChange();
      setName("");
      await mutate(["resourcePools", orgId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating resource:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = resourceType && name && quantity && !isSubmitting;

  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<AddIcon />}
        onPress={onOpen}
      >
        Resource
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="dark:text-white flex flex-col gap-1">
                Add Resource to {nodeName}
              </ModalHeader>
              <ModalBody>
                <div className=" dark:text-white flex flex-col gap-4">
                  <Select
                    label="Resource Type"
                    placeholder="Select resource type"
                    selectedKeys={resourceType ? [resourceType] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setResourceType(selected);
                    }}
                    isRequired
                  >
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.id} className="dark:text-white">{type.name}</SelectItem>
                    ))}
                  </Select>

                  <Input
                    label="Resource Name"
                    placeholder="e.g., Main CPU Pool"
                    value={name}
                    onValueChange={setName}
                    isRequired
                  />

                  <Input
                    type="number"
                    label="Quantity"
                    placeholder="e.g., 100"
                    value={quantity}
                    onValueChange={setQuantity}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isDisabled={!isFormValid}
                  isLoading={isSubmitting}
                >
                  Add Resource
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
