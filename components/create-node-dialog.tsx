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
import { createResourceNode } from "@/api/resource";
import { mutate } from "swr";

interface CreateNodeDialogProps {
  orgId?: string;
  poolId: string;
  poolName: string;
}

export default function CreateNodeDialog({
  orgId,
  poolId,
  poolName,
}: CreateNodeDialogProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const data = {
      resource_pool_id: poolId,
      name: name,
    };

    try {
      await createResourceNode(data);
      onOpenChange();
      setName("");
      await mutate(["resourcePools", orgId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating resource node:", error);
    } finally {
      setIsSubmitting(false);
    }
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
              <ModalHeader className=" dark:text-white flex flex-col gap-1">
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
                  isLoading={isSubmitting}
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
