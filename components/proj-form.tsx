import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useState } from "react";

type Props = {
  orgId?: string;
  setOnClose?: () => void;
};

const ProjForm = ({ orgId, setOnClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quotaItems = [
    { label: "CPU", unit: "Core", key: "cpu" },
    { label: "GPU", unit: "GiB", key: "gpu" },
    { label: "RAM", unit: "GiB", key: "ram" },
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted with data:", data);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Project:</span>
          <span>{projectId || "Project 01"}</span>
        </div>
      </div> */}
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col mb-2">
            <Input
              type="text"
              label="Project Name"
              name="projectName"
              labelPlacement="outside-top"
              classNames={{
                label: "text-medium font-semibold",
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            {" "}
            <span className="text-medium font-semibold dark:text-white">Quota Limits</span>
            {quotaItems.map((item) => (
              <div key={item.key} className="flex items-center gap-4">
                <Input
                  label={item.label}
                  labelPlacement="outside-left"
                  name={item.key}
                  type="number"
                  min={0}
                  classNames={{
                    input: "text-center",
                    label: "w-16 font-semibold",
                  }}
                />
                <span className="w-12 text-left font-semibold text-xs text-gray-700 dark:text-gray-300">
                  {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-end gap-2">
          <Button variant="bordered" className="w-24" onPress={setOnClose}>
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
