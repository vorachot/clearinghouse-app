"use client";

import { useParams } from "next/navigation";

const ProjectDetailPage = () => {
  const params = useParams();
  const { orgId, projectId } = params as { orgId: string; projectId: string };
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Project Detail Page
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
        Organization ID: {orgId}
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
        Project ID: {projectId}
      </p>
    </div>
  );
};
export default ProjectDetailPage;
