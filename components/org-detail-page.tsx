"use client";

import { useParams } from "next/navigation";
import ProjectCard from "./project-card";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";

const projects = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
];

const OrgDetailPage = () => {
  const params = useParams();
  const { orgId } = params as { orgId: string };
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Projects
          <span className="text-lg font-md">
            {" "}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              in
            </span>{" "}
            Organization {orgId}
          </span>
        </h1>
        <Button
          size="sm"
          color="primary"
          className="gap-0"
          startContent={<AddIcon />}
        >
          {" "}
          Project
        </Button>
      </div>
      <div className="flex gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            organizationId={orgId}
            id={project.id}
            name={project.name}
          />
        ))}
      </div>
    </div>
  );
};
export default OrgDetailPage;
