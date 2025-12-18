"use client";

import { useParams } from "next/navigation";
import ProjectCard from "./project-card";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";
import CreateProjDialog from "./create-proj-dialog";
import { useState } from "react";

const projects = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
  { id: "3", name: "Project Gamma" },
  { id: "4", name: "Project Delta" },
];

const OrgDetailPage = () => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenCreateProject = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };
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
          onPress={handleOpenCreateProject}
        >
          {" "}
          Project
        </Button>
      </div>
      <div className="flex gap-4 flex-wrap">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            organizationId={orgId}
            id={project.id}
            name={project.name}
          />
        ))}
      </div>
      {open && <CreateProjDialog orgId={orgId} setOnClose={onClose} />}
    </div>
  );
};
export default OrgDetailPage;
