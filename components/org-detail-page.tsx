"use client";

import { useParams } from "next/navigation";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";
import CreateProjDialog from "./create-proj-dialog";
import { useState } from "react";
import { getOrganizationById } from "@/api/org";
import useSWR from "swr";
import Loading from "@/app/loading";
import { OrgDetail } from "@/types/org";
import {
  FolderCopyRounded,
  PersonRounded,
  GroupRounded,
  PersonAddRounded,
  BusinessRounded,
  CalendarTodayRounded,
  DescriptionRounded,
} from "@mui/icons-material";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";
import AddMemberDialog from "./add-member-dialog";
import ProjectTable from "./project-table";
import MemberModal from "./member-modal";

const projects = [
  { id: "1", name: "Project Alpha" },
  { id: "2", name: "Project Beta" },
  { id: "3", name: "Project Gamma" },
  { id: "4", name: "Project Delta" },
];

const members = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
  },
  {
    id: "3",
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@example.com",
  },
  {
    id: "4",
    first_name: "Bob",
    last_name: "Brown",
    email: "bob.brown@example.com",
  },
  {
    id: "5",
    first_name: "Charlie",
    last_name: "Davis",
    email: "charlie.davis@example.com",
  },
];

const INITIAL_DISPLAY_COUNT = 1;

const OrgDetailPage = () => {
  const params = useParams();
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
  const { data, error, isLoading } = useSWR(
    ["orgs", orgId],
    () => getOrganizationById(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading organization</div>;

  const organization: OrgDetail = data || {};

  const displayedMembers = members?.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreMembers = (members?.length || 0) > INITIAL_DISPLAY_COUNT;

  // if (!organization.projects || organization.projects.length === 0) {
  if (projects.length === 0) {
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
              Organization{" "}
              <span className="font-semibold text-blue-600">
                {organization.name}
              </span>
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

        {/* Organization Info and Members Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Organization Details Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="flex gap-3 pb-2">
              <BusinessRounded className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Organization Details</p>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  {organization.name}
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody className="gap-4">
              {organization.description && (
                <div className="flex gap-3">
                  <DescriptionRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {organization.description}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <CalendarTodayRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {/* {organization.created_at
                      ? new Date(organization.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"} */}
                    N/A
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <FolderCopyRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Projects
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {organization.projects?.length || 0} project
                    {organization.projects?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Members Card */}
          <Card className="bg-white dark:bg-gray-800 shadow-md">
            <CardHeader className="flex gap-3 pb-2 justify-between">
              <div className="flex gap-3">
                <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">Members</p>
                  <p className="text-small text-gray-500 dark:text-gray-400">
                    {members?.length || 0} member
                    {members?.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                color="success"
                variant="flat"
                startContent={<PersonAddRounded />}
                onPress={handleOpenAddMember}
              >
                Member
              </Button>
            </CardHeader>
            <Divider />
            <CardBody className="gap-2">
              {displayedMembers && displayedMembers.length > 0 ? (
                <>
                  {displayedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <PersonRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                      <Chip size="sm" color="success" variant="flat">
                        Member
                      </Chip>
                    </div>
                  ))}
                  {hasMoreMembers && (
                    <Button
                      size="sm"
                      variant="flat"
                      color="success"
                      className="w-full mt-2"
                      onPress={() => setOpenMembersModal(true)}
                    >
                      View All {members?.length || 0} Members
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No members assigned
                </p>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="h-[400px] flex flex-col justify-center items-center text-center opacity-50">
          <FolderCopyRounded className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No Available Projects in this Organization
          </h3>
        </div>
        {open && <CreateProjDialog orgId={orgId} setOnClose={onClose} />}
        {openAddMember && (
          <AddMemberDialog orgId={orgId} onClose={handleCloseAddMember} />
        )}

        {/* Members Modal */}
        <Modal
          isOpen={openMembersModal}
          onClose={() => setOpenMembersModal(false)}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader className="flex gap-2 items-center">
              <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
              <span className="dark:text-white">
                All Members ({members?.length || 0})
              </span>
            </ModalHeader>
            <ModalBody className="p-0">
              <ScrollShadow className="max-h-[60vh]">
                <div className="p-4 space-y-2">
                  {members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <PersonRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {member.email}
                        </p>
                      </div>
                      <Chip size="sm" color="success" variant="flat">
                        Member
                      </Chip>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button
                color="success"
                variant="flat"
                onPress={() => setOpenMembersModal(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  }

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
            Organization{" "}
            <span className="font-semibold text-blue-600">
              {organization.name}
            </span>
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

      {/* Organization Info and Members Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Organization Details Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="flex gap-3 pb-2">
            <BusinessRounded className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Organization Details</p>
              <p className="text-small text-gray-500 dark:text-gray-400">
                {organization.name}
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            {organization.description && (
              <div className="flex gap-3">
                <DescriptionRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {organization.description}
                  </p>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <CalendarTodayRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Created
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {/* {organization.created_at
                    ? new Date(organization.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "N/A"} */}
                  N/A
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <FolderCopyRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Projects
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {organization.projects?.length || 0} project
                  {organization.projects?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Members Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="flex gap-3 pb-2 justify-between">
            <div className="flex gap-3">
              <GroupRounded className="!w-6 !h-6 text-green-600 dark:text-green-400" />
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Members</p>
                <p className="text-small text-gray-500 dark:text-gray-400">
                  {members?.length || 0} member
                  {members?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              color="success"
              variant="flat"
              startContent={<PersonAddRounded />}
              onPress={handleOpenAddMember}
            >
              Member
            </Button>
          </CardHeader>
          <Divider />
          <CardBody className="gap-2">
            {displayedMembers && displayedMembers.length > 0 ? (
              <>
                {displayedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <PersonRounded className="!w-5 !h-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {member.first_name} {member.last_name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                    </div>
                    <Chip size="sm" color="success" variant="flat">
                      Member
                    </Chip>
                  </div>
                ))}
                {hasMoreMembers && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    className="w-full mt-2"
                    onPress={() => setOpenMembersModal(true)}
                  >
                    View All {members?.length || 0} Members
                  </Button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No members assigned
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Projects Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Projects List
        </h2>
        <ProjectTable organizationId={orgId} projects={projects} />
      </div>
      {open && <CreateProjDialog orgId={orgId} setOnClose={onClose} />}
      {openAddMember && (
        <AddMemberDialog orgId={orgId} onClose={handleCloseAddMember} />
      )}

      {/* Members Modal */}
      {openMembersModal && (
        <MemberModal
          isOpen={openMembersModal}
          setOpenMembersModal={setOpenMembersModal}
          members={members}
        />
      )}
    </div>
  );
};
export default OrgDetailPage;
