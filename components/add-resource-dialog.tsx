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
  poolId: string;
  poolName: string;
}

export default function AddResourceDialog({
  poolId,
  poolName,
}: AddResourceDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [resourceType, setResourceType] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [maxDuration, setMaxDuration] = useState("");

  // Mock resource types - should be fetched from API
  const resourceTypes = [
    { id: "1", name: "CPU" },
    { id: "2", name: "GPU" },
    { id: "3", name: "RAM" },
  ];

  // Suggest units based on resource type
  const getUnitsForType = (type: string) => {
    switch (type) {
      case "CPU":
        return ["Core", "vCPU"];
      case "GPU":
        return ["Unit", "GB"];
      case "RAM":
        return ["GB", "TB"];
      default:
        return ["Unit"];
    }
  };

  const handleSubmit = () => {
    // TODO: Implement API call to add resource to pool
    const resource = {
      poolId,
      resourceTypeId: resourceType,
      amount: parseFloat(amount),
      unit,
      price: parseFloat(price),
      maxDuration: parseFloat(maxDuration),
    };
    console.log("Adding resource to pool:", resource);
    onOpenChange();
    // Reset form
    setResourceType("");
    setAmount("");
    setUnit("");
    setPrice("");
    setMaxDuration("");
  };

  const isFormValid = resourceType && amount && unit && price && maxDuration;

  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<AddIcon />}
        onPress={onOpen}
      >
        Add Resource
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Resource to {poolName}
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
                      setUnit(""); // Reset unit when type changes
                    }}
                    isRequired
                  >
                    {resourceTypes.map((type) => (
                      <SelectItem key={type.id}>{type.name}</SelectItem>
                    ))}
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Amount"
                      placeholder="e.g., 100"
                      value={amount}
                      onValueChange={setAmount}
                      isRequired
                    />
                    <Select
                      label="Unit"
                      placeholder="Select unit"
                      selectedKeys={unit ? [unit] : []}
                      onSelectionChange={(keys) =>
                        setUnit(Array.from(keys)[0] as string)
                      }
                      isRequired
                      isDisabled={!resourceType}
                    >
                      {getUnitsForType(
                        resourceTypes.find((t) => t.id === resourceType)
                          ?.name || ""
                      ).map((u) => (
                        <SelectItem key={u}>{u}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Input
                    type="number"
                    label="Price per Hour (฿)"
                    placeholder="e.g., 10"
                    value={price}
                    onValueChange={setPrice}
                    isRequired
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">฿</span>
                      </div>
                    }
                  />

                  <Input
                    type="number"
                    label="Max Duration per Session (hours)"
                    placeholder="e.g., 24"
                    value={maxDuration}
                    onValueChange={setMaxDuration}
                    isRequired
                  />

                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Preview:</p>
                    {resourceType && amount && unit && price ? (
                      <p className="text-sm">
                        {resourceTypes.find((t) => t.id === resourceType)?.name}
                        : {amount} {unit} @ ฿{price}/hour
                        {maxDuration && ` (Max: ${maxDuration} hours)`}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Fill in the form to see preview
                      </p>
                    )}
                  </div>
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
