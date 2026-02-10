"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { EditRounded } from "@mui/icons-material";

type EditResourceDialogProps = {
  isOpen: boolean;
  resourceId: string;
  resourceName: string;
  resourceQuantity: number;
  onClose: () => void;
  onConfirm: (
    resourceId: string,
    data: { name: string; quantity: number },
  ) => void;
  isUpdating?: boolean;
  error?: string | null;
};

const EditResourceDialog = ({
  isOpen,
  resourceId,
  resourceName,
  resourceQuantity,
  onClose,
  onConfirm,
  isUpdating = false,
  error,
}: EditResourceDialogProps) => {
  const [formData, setFormData] = useState({
    name: resourceName,
    quantity: resourceQuantity,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: resourceName,
        quantity: resourceQuantity,
      });
    }
  }, [isOpen, resourceName, resourceQuantity]);

  const handleSubmit = () => {
    onConfirm(resourceId, formData);
  };

  const isFormValid = formData.name.trim() !== "" && formData.quantity > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <EditRounded />
          <span>Edit Resource</span>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Resource Name"
              placeholder="Enter resource name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isRequired
            />
            <Input
              type="number"
              label="Quantity"
              placeholder="Enter quantity"
              value={formData.quantity.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              min={1}
              isRequired
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isUpdating}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isUpdating}
            isDisabled={!isFormValid || isUpdating}
          >
            Update Resource
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditResourceDialog;
