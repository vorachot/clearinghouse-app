"use client";

import { useParams } from "next/navigation";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";

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
    </div>
  );
};
export default ProjectDetailPage;
