"use client";

import { getOrganizationById, updateOrganization } from "@/api/org";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { FormEvent, useState, useEffect } from "react";
import { mutate } from "swr";
import useSWR from "swr";

type Props = {
  orgId: string;
  setOnClose?: () => void;
};

const UpdateOrgForm = ({ orgId, setOnClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orgName, setOrgName] = useState("");

  // Fetch the organization data
  const { data: organization, isLoading } = useSWR(
    ["orgs", orgId],
    () => getOrganizationById(orgId),
    {
      revalidateOnFocus: false,
    },
  );

  // Pre-fill the form when data is loaded
  useEffect(() => {
    if (organization) {
      setOrgName(organization.name || "");
    }
  }, [organization]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: "-",
    };

    try {
      await updateOrganization(orgId, data);
      if (setOnClose) {
        setOnClose();
      }
      // Revalidate the organization list and specific org data
      await mutate(["orgs"], undefined, {
        revalidate: true,
      });
      await mutate(["orgs", orgId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error updating organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-3 mb-6">
          <div className="w-full flex flex-col">
            <Input
              type="text"
              label="Organization Name"
              placeholder="e.g., KMITL"
              name="name"
              value={orgName}
              onValueChange={setOrgName}
              isRequired
            />
          </div>
        </div>

        <div className="w-full flex justify-end gap-2">
          <Button color="danger" variant="light" onPress={setOnClose}>
            Cancel
          </Button>
          <Button
            className="w-24"
            color="primary"
            isLoading={isSubmitting}
            type="submit"
          >
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default UpdateOrgForm;
