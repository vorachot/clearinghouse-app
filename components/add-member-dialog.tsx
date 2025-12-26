"use client";

import { FormEvent, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { PersonAddRounded } from "@mui/icons-material";
import { addMemberToOrg } from "@/api/org";
import { mutate } from "swr";
import { Form } from "@heroui/form";

interface AddMemberDialogProps {
  orgId?: string;
  onClose?: () => void;
}

const AddMemberDialog = ({ orgId, onClose }: AddMemberDialogProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleAddMember = async () => {
  //   if (!email.trim()) return;

  //   setIsLoading(true);
  //   try {
  //     // TODO: Call your API to add member
  //     // await addMemberToOrg(orgId, email);
  //     console.log("Adding member:", email, "to org:", orgId);

  //     // Show success message
  //     alert("Member added successfully!");
  //     onClose();
  //   } catch (error) {
  //     console.error("Error adding member:", error);
  //     alert("Failed to add member");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      organization_id: orgId??"",
      members: [formData.get("email") as string],
    };

    try {
      await addMemberToOrg(data);
      if (onClose) {
        onClose();
      }
      await mutate(["orgs"], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

    return (
      <Modal isOpen onClose={onClose} size="md">
        <ModalContent>
          <Form onSubmit={handleSubmit}>
          <ModalHeader className="flex gap-2 items-center">
            <PersonAddRounded className="!w-6 !h-6 text-green-600" />
            Add Member to Organization
          </ModalHeader>
          <ModalBody>
            <Input
              type="string"
              label="Member Email"
              placeholder="Enter member's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="bordered"
              isRequired
            />
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter the email address of the user you want to add as a member.
          </p> */}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="success"
              isLoading={isSubmitting}
              isDisabled={!email.trim()}
            >
              Add Member
            </Button>
          </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  };
export default AddMemberDialog;
