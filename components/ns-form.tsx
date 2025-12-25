import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { useState } from "react";

type Props = {
  orgId?: string;
  projectId?: string;
  setOnClose?: () => void;
};

const NsForm = ({ orgId, projectId, setOnClose }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data for pools and members
  const quotaPools = [
    { key: "pool1", label: "Pool1", cpu: 8, gpu: 8, ram: 8 },
    { key: "pool2", label: "Pool2", cpu: 16, gpu: 16, ram: 16 },
  ];

  const members = [
    { key: "member1", label: "Member1", avatar: "🔥" },
    { key: "member2", label: "Member2", avatar: "💧" },
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted with data:", data);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-6">
          {/* Namespace */}
          <div className="flex flex-col">
            <Input
              type="text"
              label="Namespace:"
              name="namespace"
              placeholder="ns-01"
              labelPlacement="outside"
              classNames={{
                label: "text-medium font-semibold mb-1",
              }}
            />
          </div>

          {/* Credit */}
          <div className="flex flex-col">
            <Input
              type="number"
              label="Credit:"
              name="credit"
              defaultValue="5000"
              labelPlacement="outside"
              classNames={{
                label: "text-medium font-semibold mb-1",
              }}
            />
          </div>

          {/* Select Quota */}
          <div className="flex flex-col">
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
          </div>

          {/* Select Member */}
          <div className="flex flex-col">
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
export default NsForm;
