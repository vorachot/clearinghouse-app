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
import { Textarea } from "@heroui/input";
import AddIcon from "@mui/icons-material/Add";

export default function CreateResourcePoolDialog() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // TODO: Implement API call to create resource pool
    console.log("Creating resource pool:", { name, description });
    onOpenChange();
    setName("");
    setDescription("");
  };

  return (
    <>
      <Button
        size="sm"
        color="success"
        startContent={<AddIcon />}
        onPress={onOpen}
      >
        Resource Pool
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Resource Pool
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Pool Name"
                    placeholder="e.g., kmitl-pool"
                    value={name}
                    onValueChange={setName}
                    isRequired
                  />
                  <Textarea
                    label="Description"
                    placeholder="Optional description"
                    value={description}
                    onValueChange={setDescription}
                  />
                  <p className="text-sm text-gray-500">
                    Note: Organization can be assigned later
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isDisabled={!name}
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
