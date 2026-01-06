import { createProject } from "@/api/project";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { FormEvent, useState } from "react";
import { mutate } from "swr";

type Props = {
  orgId?: string;
  setOnClose?: () => void;
};

const ProjForm = ({ orgId, setOnClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      organization_id: orgId ?? "",
    };

    try {
      await createProject(data);
      if (setOnClose) {
        setOnClose();
      }
      await mutate(["orgs", orgId, "projects"], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error creating organization:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-3 mb-6">
          <div className="w-full flex flex-col">
            <Input
              type="text"
              label="Project Name"
              placeholder="e.g., project-alpha"
              name="name"
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
            Create
          </Button>
        </div>
      </Form>
    </div>
  );
};
export default ProjForm;
