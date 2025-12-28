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

interface CreateNodeDialogProps {
  poolId: string;
  poolName: string;
}

export default function CreateNodeDialog({
  poolId,
  poolName,
}: CreateNodeDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // TODO: Implement API call to create node
    console.log("Creating node:", { poolId, name, description });
    onOpenChange();
    setName("");
    setDescription("");
  };

  return (
    <>
      <Button
        size="sm"
        color="secondary"
        startContent={<AddIcon />}
        onPress={onOpen}
      >
        Node
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Node in {poolName}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Input
                    label="Node Name"
                    placeholder="e.g., node-01, server-rack-a"
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
                    Resources can be added to this node after creation
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
                  Create Node
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
