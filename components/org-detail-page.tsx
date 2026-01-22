"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import AddIcon from "@mui/icons-material/Add";
import CreateProjDialog from "./create-proj-dialog";
import { useState } from "react";
import { getOrganizationById } from "@/api/org";
import { getProjectsByOrgId } from "@/api/project";
import useSWR from "swr";
import Loading from "@/app/loading";
import { OrgDetail } from "@/types/org";
import {
  FolderCopyRounded,
  Inventory2Outlined,
  PieChartOutlineRounded,
  ArrowForwardRounded,
} from "@mui/icons-material";
import AddMemberDialog from "./add-member-dialog";
import ProjectTable from "./project-table";
import MemberModal from "./member-modal";
import MemberCard from "./member-card";
import { Project } from "@/types/project";

const OrgDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { orgId } = params as { orgId: string };
  const [open, setOpen] = useState(false);
  const [openMembersModal, setOpenMembersModal] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenCreateProject = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };
  const handleOpenAddMember = () => setOpenAddMember(true);
  const handleCloseAddMember = () => setOpenAddMember(false);
  const organizationData = useSWR(
    ["orgs", orgId],
    () => getOrganizationById(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const projectsData = useSWR(
    ["orgs", orgId, "projects"],
    () => getProjectsByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  const projects: Project[] = projectsData.data || [];

  if (organizationData.isLoading) return <Loading />;
  if (organizationData.error) return <div>Error loading organization</div>;

  const organization: OrgDetail = organizationData.data || {};
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Organization Management
          <span className="text-lg font-md">
            {" "}
            <span className="dark:text-gray-400 text-gray-900 font-normal">
              for
            </span>{" "}
            <span className="font-semibold text-blue-600">
              {organization.name}
            </span>
          </span>
        </h1>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Resources Card */}
        <Card
          isPressable
          isHoverable
          onPress={() => router.push(`/organizations/${orgId}/resources`)}
          className="cursor-pointer transition-all hover:scale-[1.02]"
        >
          <CardBody className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Inventory2Outlined className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resources
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Manage resource pools, types, and allocations for this
                  organization
                </p>
              </div>
              <ArrowForwardRounded className="!w-5 !h-5 text-gray-400 ml-2" />
            </div>
          </CardBody>
        </Card>

        {/* Quotas Card */}
        <Card
          isPressable
          isHoverable
          onPress={() => router.push(`/organizations/${orgId}/quotas`)}
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
                    Quotas
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Set and monitor resource quotas and usage limits
                </p>
              </div>
              <ArrowForwardRounded className="!w-5 !h-5 text-gray-400 ml-2" />
            </div>
          </CardBody>
        </Card>

        {/* Members Card */}
        <MemberCard
          members={organization.members}
          handleOpenAddMember={handleOpenAddMember}
          setOpenMembersModal={setOpenMembersModal}
        />
      </div>

      {/* Projects Section - Conditional Rendering */}
      {projects.length === 0 ? (
        <div>
          <div className="flex items-center justify-end mb-4">
            <Button
              size="sm"
              color="primary"
              className="gap-0"
              startContent={<AddIcon />}
              onPress={handleOpenCreateProject}
            >
              Project
            </Button>
          </div>
          <div className="h-[200px] flex flex-col justify-center items-center text-center opacity-50">
            <FolderCopyRounded className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No Available Projects in this Organization
            </h3>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Projects List
            </h2>
            <Button
              size="sm"
              color="primary"
              className="gap-0"
              startContent={<AddIcon />}
              onPress={handleOpenCreateProject}
            >
              Project
            </Button>
          </div>
          <ProjectTable organizationId={orgId} projects={projects} />
        </div>
      )}

      {open && <CreateProjDialog orgId={orgId} setOnClose={onClose} />}
      {openAddMember && (
        <AddMemberDialog
          orgId={orgId}
          onClose={handleCloseAddMember}
          existingMembers={organization.members}
        />
      )}

      {/* Members Modal */}
      {openMembersModal && (
        <MemberModal
          isOpen={openMembersModal}
          setOpenMembersModal={setOpenMembersModal}
          members={organization.members}
          orgId={orgId}
        />
      )}
    </div>
  );
};

export default OrgDetailPage;
