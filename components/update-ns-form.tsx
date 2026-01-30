"use client";

import { getNamespaceById, updateNamespace } from "@/api/namespace";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { FormEvent, useState, useEffect } from "react";
import { mutate } from "swr";
import useSWR from "swr";

type Props = {
  namespaceId: string;
  projectId: string;
  setOnClose?: () => void;
};

const UpdateNamespaceForm = ({ namespaceId, projectId, setOnClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [namespaceName, setNamespaceName] = useState("");
  const [description, setDescription] = useState("");
  const [credit, setCredit] = useState("");

  // Fetch the namespace data
  const { data: namespace, isLoading } = useSWR(
    ["namespaces", namespaceId],
    () => getNamespaceById(namespaceId),
    {
      revalidateOnFocus: false,
    },
  );

  // Pre-fill the form when data is loaded
  useEffect(() => {
    if (namespace) {
      setNamespaceName(namespace.name || "");
      setDescription(namespace.description || "");
      setCredit(namespace.credit?.toString() || "0");
    }
  }, [namespace]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      namespace_id: namespaceId,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      credit: parseFloat(formData.get("credit") as string),
    };

    try {
      await updateNamespace(data);
      if (setOnClose) {
        setOnClose();
      }
      await mutate(["namespaces", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error updating namespace:", error);
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
              label="Namespace Name"
              placeholder="e.g., dev-namespace"
              name="name"
              value={namespaceName}
              onValueChange={setNamespaceName}
              isRequired
            />
          </div>
          <div className="w-full flex flex-col">
            <Textarea
              label="Description"
              placeholder="Enter namespace description"
              name="description"
              value={description}
              onValueChange={setDescription}
            />
          </div>
          <div className="w-full flex flex-col">
            <Input
              type="number"
              label="Credit"
              placeholder="e.g., 100"
              name="credit"
              value={credit}
              onValueChange={setCredit}
              isRequired
              min="0"
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
export default UpdateNamespaceForm;
