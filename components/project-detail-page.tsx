"use client";

import { useParams } from "next/navigation";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";
import NsCard from "./ns-card";

const namespaces = [
  { id: "1", name: "Namespace One" },
  { id: "2", name: "Namespace Two" },
  { id: "3", name: "Namespace Three" },
  { id: "4", name: "Namespace Four" },
]

const ProjectDetailPage = () => {
  const params = useParams();
  const { orgId, projectId } = params as { orgId: string; projectId: string };
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        {" "}
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Namespaces
          <span className="text-lg font-md">
            {" "}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              in
            </span>{" "}
            Organization {orgId}
          </span>
          <span className="text-lg font-md">
            {" "}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              in
            </span>{" "}
            Project {projectId}
          </span>
        </h1>
        <Button
          size="sm"
          color="primary"
          className="gap-0"
          startContent={<AddIcon />}
        >
          {" "}
          Namespace
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        {namespaces.map((namespace) => (
          <NsCard
            key={namespace.id}
            organizationId={orgId}
            projectId={projectId}
            id={namespace.id}
            name={namespace.name}
          />
        ))}
      </div>
    </div>
  );
};
export default ProjectDetailPage;
