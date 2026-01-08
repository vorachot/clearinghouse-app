import { createNamespace } from "@/api/namespace";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { FormEvent, useState } from "react";
import { mutate } from "swr";

type Props = {
  orgId?: string;
  projectId?: string;
  setOnClose?: () => void;
};

const NsForm = ({ orgId, projectId, setOnClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [credit, setCredit] = useState("");

  // Mock data for pools and members
  // const quotaPools = [
  //   { key: "pool1", label: "Pool1", cpu: 8, gpu: 8, ram: 8 },
  //   { key: "pool2", label: "Pool2", cpu: 16, gpu: 16, ram: 16 },
  // ];

  // const members = [
  //   { key: "member1", label: "Member1", avatar: "🔥" },
  //   { key: "member2", label: "Member2", avatar: "💧" },
  // ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: description ? description : "-",
      credit: Number(credit),
      project_id: projectId ?? "",
    };

    try {
      await createNamespace(data);
      if (setOnClose) {
        setOnClose();
      }
      await mutate(["namespaces", projectId], undefined, {
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
        <div className="w-full flex flex-col gap-4 mb-6">
          {/* Namespace */}
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              label="Namespace Name"
              placeholder="e.g., ns-01"
              name="name"
              isRequired
            />
            <Textarea
              label="Description"
              placeholder="Optional description"
              value={description}
              onValueChange={setDescription}
            />
            <Input
              type="number"
              label="Credit"
              placeholder="e.g., 100"
              value={credit}
              onValueChange={setCredit}
              isRequired
            />
          </div>
          {/* Select Quota */}
          {/* <div className="flex flex-col">
            <Select
              label="Select Quota"
              name="quota"
              labelPlacement="outside"
              placeholder="Select a pool"
              classNames={{
                label: "text-medium font-semibold mb-1",
              }}
            >
              {quotaPools.map((pool) => (
                <SelectItem
                  key={pool.key}
                  textValue={pool.label}
                  description={`CPU:${pool.cpu} GPU:${pool.gpu} RAM: ${pool.ram}`}
                >
                  {pool.label}
                </SelectItem>
              ))}
            </Select>
          </div> */}

          {/* Select Member */}
          {/* <div className="flex flex-col">
            <Select
              label="Select Member"
              name="members"
              selectionMode="multiple"
              labelPlacement="outside"
              placeholder="Select members"
              classNames={{
                label: "text-medium font-semibold mb-1",
              }}
            >
              {members.map((member) => (
                <SelectItem
                  key={member.key}
                  textValue={member.label}
                  startContent={<span>{member.avatar}</span>}
                >
                  {member.label}
                </SelectItem>
              ))}
            </Select>
          </div> */}
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
export default NsForm;
