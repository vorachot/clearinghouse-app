"use client";

import { useParams } from "next/navigation";
import ProjectCard from "./project-card";

const projects = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
];

const OrgDetailPage = () => {
  const params = useParams();
  const { orgId  } = params as { orgId: string };
  return (
    <div className="container mx-auto pt-1 p-4 space-y-3">
      <div className="flex items-end gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Your Projects
          <span className="text-xl font-md"> in Organization {orgId}</span>
        </h1>
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
