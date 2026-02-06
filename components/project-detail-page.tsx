"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import AddIcon from "@mui/icons-material/Add";
import NsCard from "./ns-card";
import { useState } from "react";
import CreateNsDialog from "./create-ns-dialog";
import useSWR from "swr";
import { getOrganizationById } from "@/api/org";
import { getProjectById } from "@/api/project";
import { OrgDetail } from "@/types/org";
import { Project } from "@/types/project";
import {
  ArrowForwardRounded,
  FolderCopyRounded,
  PieChartOutlineRounded,
} from "@mui/icons-material";
import MemberCard from "./member-card";
import { getNamespaceByProjectId } from "@/api/namespace";
import { Namespace } from "@/types/namespace";
import NamespaceTable from "./namespace-table";
import AddProjectMemberDialog from "./add-project-member-dialog";
import AddProjectAdminDialog from "./add-project-admin-dialog";
import ProjectMemberModal from "./project-member-modal";

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openAddAdmin, setOpenAddAdmin] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenCreateNs = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };
  const handleOpenAddMember = () => setOpenAddMember(true);
  const handleCloseAddMember = () => setOpenAddMember(false);
  const handleOpenAddAdmin = () => setOpenAddAdmin(true);
  const handleCloseAddAdmin = () => setOpenAddAdmin(false);
  const { orgId, projectId } = params as { orgId: string; projectId: string };
  const organizationData = useSWR(
    ["org", orgId],
    () => getOrganizationById(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );
  const projectData = useSWR(
    ["project", projectId],
    () => getProjectById(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );
  const namespacesData = useSWR(
    ["namespaces", projectId],
    () => getNamespaceByProjectId(projectId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  const organization: OrgDetail = organizationData.data || {};
  const project: Project = projectData.data || {};
  const namespaces: Namespace[] = namespacesData.data || [];

  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Project Management
          <span className="text-lg font-md">
            {" "}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              for
            </span>{" "}
            {project && (
              <span className="font-semibold text-blue-600">
                {project.name}
              </span>
            )}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              {" "}
              in
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
            router.push(`/organizations/${orgId}/${projectId}/quotas`)
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
                    Project & Namespace Quotas
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-3">
                  Manage resource allocation for this project
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      External & internal project quotas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Namespace quota configuration
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Create & group quota templates
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Assign templates to namespaces
                    </span>
                  </div>
                </div>
              </div>
              <ArrowForwardRounded className="!w-5 !h-5 text-gray-400 ml-2 mt-1" />
            </div>
          </CardBody>
        </Card>

        {/* Members Card */}
        <MemberCard
          members={project.members}
          admins={project.admins}
          handleOpenAddMember={handleOpenAddMember}
          handleOpenAddAdmin={handleOpenAddAdmin}
          setOpenMembersModal={setOpenMembersModal}
        />
      </div>
      {namespaces.length === 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Namespaces List
            </h2>
            <Button
              size="sm"
              color="primary"
              className="gap-0"
              startContent={<AddIcon />}
              onPress={handleOpenCreateNs}
            >
              Namespace
            </Button>
          </div>
          <div className="h-[200px] flex flex-col justify-center items-center text-center opacity-50">
            <FolderCopyRounded className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No Available Namespace in this Project
            </h3>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Namespaces List
            </h2>
            <Button
              size="sm"
              color="primary"
              className="gap-0"
              startContent={<AddIcon />}
              onPress={handleOpenCreateNs}
            >
              Namespace
            </Button>
          </div>
          <NamespaceTable
            organizationId={orgId}
            projectId={projectId}
            namespaces={namespaces}
          />
        </div>
      )}
      {/* <div className="flex gap-4 flex-wrap">
        {namespaces.map((namespace) => (
          <NsCard
            key={namespace.id}
            organizationId={orgId}
            projectId={projectId}
            id={namespace.id}
            name={namespace.name}
          />
        ))}
      </div> */}
      {open && (
        <CreateNsDialog
          orgId={orgId}
          projectId={projectId}
          setOnClose={onClose}
        />
      )}
      {openAddMember && (
        <AddProjectMemberDialog
          projectId={projectId}
          orgId={orgId}
          onClose={handleCloseAddMember}
          existingMembers={project.members}
          admins={project.admins}
        />
      )}
      {openAddAdmin && (
        <AddProjectAdminDialog
          projectId={projectId}
          orgId={orgId}
          onClose={handleCloseAddAdmin}
          existingMembers={project.members}
          existingAdmins={project.admins}
          orgAdmins={organization.admins}
        />
      )}

      {/* Members Modal */}
      {openMembersModal && (
        <ProjectMemberModal
          isOpen={openMembersModal}
          setOpenMembersModal={setOpenMembersModal}
          members={project.members}
          admins={project.admins}
          projectId={projectId}
        />
      )}
    </div>
  );
};
export default ProjectDetailPage;
