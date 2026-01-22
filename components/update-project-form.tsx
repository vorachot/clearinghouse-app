"use client";

import { getProjectById, updateProject } from "@/api/project";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { FormEvent, useState, useEffect } from "react";
import { mutate } from "swr";
import useSWR from "swr";

type Props = {
  projectId: string;
  organizationId: string;
  setOnClose?: () => void;
};

const UpdateProjectForm = ({
  projectId,
  organizationId,
  setOnClose,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectName, setProjectName] = useState("");

  // Fetch the project data
  const { data: project, isLoading } = useSWR(
    ["projects", projectId],
    () => getProjectById(projectId),
    {
      revalidateOnFocus: false,
    },
  );

  // Pre-fill the form when data is loaded
  useEffect(() => {
    if (project) {
      setProjectName(project.name || "");
    }
  }, [project]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      project_id: projectId,
      name: formData.get("name") as string,
      description: "-",
    };

    try {
      await updateProject(data);
      if (setOnClose) {
        setOnClose();
      }
      // Revalidate the project list and specific project data
      await mutate(["orgs", organizationId, "projects"], undefined, {
        revalidate: true,
      });
      await mutate(["projects", projectId], undefined, {
        revalidate: true,
      });
    } catch (error) {
      console.error("Error updating project:", error);
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
              label="Project Name"
              placeholder="e.g., project-alpha"
              name="name"
              value={projectName}
              onValueChange={setProjectName}
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
export default UpdateProjectForm;
