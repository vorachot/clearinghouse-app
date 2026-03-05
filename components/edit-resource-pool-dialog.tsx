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

type EditResourcePoolDialogProps = {
  isOpen: boolean;
  poolId: string;
  poolName: string;
  glideLetUrn: string;
  onClose: () => void;
  onConfirm: (
    poolId: string,
    data: { name: string; glidelet_urn: string },
  ) => void;
  isUpdating?: boolean;
  error?: string | null;
};

const EditResourcePoolDialog = ({
  isOpen,
  poolId,
  poolName,
  glideLetUrn,
  onClose,
  onConfirm,
  isUpdating = false,
  error,
}: EditResourcePoolDialogProps) => {
  const [formData, setFormData] = useState({
    name: poolName,
    glidelet_urn: glideLetUrn,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: poolName,
        glidelet_urn: glideLetUrn,
      });
    }
  }, [isOpen, poolName, glideLetUrn]);

  const handleSubmit = () => {
    onConfirm(poolId, formData);
  };

  const isFormValid =
    formData.name.trim() !== "" && formData.glidelet_urn.trim() !== "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <EditRounded />
          <span>Edit Resource Pool</span>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Pool Name"
              placeholder="Enter pool name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isRequired
            />
            <Input
              label="Glidelet URN"
              placeholder="Enter glidelet URN"
              value={formData.glidelet_urn}
              onChange={(e) =>
                setFormData({ ...formData, glidelet_urn: e.target.value })
              }
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
            Update Pool
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditResourcePoolDialog;
