"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import useSWR from "swr";
import { getOrganizationById } from "@/api/org";
import { getProjectById } from "@/api/project";
import { Organization } from "@/types/org";
import { Project } from "@/types/project";
import {
  ArrowForwardRounded,
  PieChartOutlineRounded,
} from "@mui/icons-material";
import MemberCard from "./member-card";
import { getNamespaceById } from "@/api/namespace";
import { Namespace } from "@/types/namespace";

const NamespaceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);

  const handleOpenAddMember = () => setOpenAddMember(true);
  const handleCloseAddMember = () => setOpenAddMember(false);
  const { orgId, projectId, namespaceId } = params as {
    orgId: string;
    projectId: string;
    namespaceId: string;
  };
  const organizationData = useSWR(
    ["org", orgId],
    () => getOrganizationById(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const projectData = useSWR(
    ["project", projectId],
    () => getProjectById(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );
  const namespaceData = useSWR(
    ["namespace", namespaceId],
    () => getNamespaceById(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );

  const organization: Organization = organizationData.data || {};
  const project: Project = projectData.data || {};
  const namespace: Namespace = namespaceData.data || {};

  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Namespace Management
          <span className="text-lg font-md">
            {" "}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              for
            </span>{" "}
            {namespace && (
              <span className="font-semibold text-blue-600">
                {namespace.name}
              </span>
            )}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              {" "}
              in
            </span>{" "}
            {project && (
              <span className="font-semibold text-blue-600">
                {project.name}
              </span>
            )}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              {" "}
              of
            </span>{" "}
            {organization && (
              <span className="font-semibold text-blue-600">
                {organization.name}
              </span>
            )}
          </span>
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Quotas Card */}
        <Card
          isPressable
          isHoverable
          onPress={() =>
            router.push(
              `/organizations/${orgId}/${projectId}/${namespaceId}/quotas`
            )
          }
          className="cursor-pointer transition-all hover:scale-[1.02]"
        >
          <CardBody className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <PieChartOutlineRounded className="!w-6 !h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    View Quotas
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  View assigned quota templates and monitor resource usage
                </p>
              </div>
              <ArrowForwardRounded className="!w-5 !h-5 text-gray-400 ml-2" />
            </div>
          </CardBody>
        </Card>

        {/* Members Card */}
        <MemberCard
          members={project.members}
          handleOpenAddMember={handleOpenAddMember}
          setOpenMembersModal={setOpenMembersModal}
        />
      </div>
    </div>
  );
};
export default NamespaceDetailPage;
