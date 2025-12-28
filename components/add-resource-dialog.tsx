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

interface AddResourceDialogProps {
  nodeId: string;
  nodeName: string;
  poolId: string;
}

export default function AddResourceDialog({
  nodeId,
  nodeName,
  poolId,
}: AddResourceDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [resourceType, setResourceType] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // Mock resource types - should be fetched from API
  const resourceTypes = [
    { id: "1", name: "CPU" },
    { id: "2", name: "GPU" },
    { id: "3", name: "RAM" },
  ];

  const handleSubmit = () => {
    // TODO: Implement API call to add resource to node
    const resource = {
      nodeId,
      poolId,
      resourceTypeId: resourceType,
      name,
      amount: parseFloat(amount),
    };
    console.log("Adding resource to node:", resource);
    onOpenChange();
    // Reset form
    setResourceType("");
    setName("");
    setAmount("");
  };

  const isFormValid = resourceType && name && amount;

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
              <ModalHeader className="flex flex-col gap-1">
                Add Resource to {nodeName}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
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
                      <SelectItem key={type.id}>{type.name}</SelectItem>
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
                    label="Amount"
                    placeholder="e.g., 100"
                    value={amount}
                    onValueChange={setAmount}
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
