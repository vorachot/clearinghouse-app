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
import { createResourcePool } from "@/api/resource";
import { mutate } from "swr";

export default function CreateResourcePoolDialog({ orgId }: { orgId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const data = {
      organization_id: orgId,
      name: name,
      glidelet_urn: "default-glidelet-urn",
    };

    try {
      await createResourcePool(data);
      onOpenChange();
      setName("");
      await mutate(["resourcePools", orgId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating resource pool:", error);
    } finally {
      setIsSubmitting(false);
    }
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
              <ModalHeader className=" dark:text-white flex flex-col gap-1">
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
                  {/* <Textarea
                    label="Description"
                    placeholder="Optional description"
                    value={description}
                    onValueChange={setDescription}
                  /> */}
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
