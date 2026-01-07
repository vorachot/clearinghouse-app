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
import AddIcon from "@mui/icons-material/Add";
import { createResourceType } from "@/api/resource";
import { mutate } from "swr";

export default function CreateResourceTypeDialog() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const data = {
      name: name,
      unit: unit,
    };

    try {
      await createResourceType(data);
      onOpenChange();
      setName("");
      setUnit("");
      await mutate(["resourceTypes"], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating resource type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        color="primary"
        startContent={<AddIcon />}
        onPress={onOpen}
      >
        Resource Type
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="dark:text-white flex flex-col gap-1">
                Create Resource Type
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g., CPU, GPU, RAM"
                    value={name}
                    onValueChange={setName}
                    isRequired
                  />
                  <Input
                    label="Unit"
                    placeholder="e.g., CORE, GiB"
                    value={unit}
                    onValueChange={setUnit}
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
                  isDisabled={!name || !unit}
                  isLoading={isSubmitting}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
