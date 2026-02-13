"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import {
  FolderOpenRounded,
  EditRounded,
  DeleteRounded,
  VisibilityRounded,
  PeopleAltRounded,
  AdminPanelSettingsRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import UpdateProjectDialog from "./update-project-dialog";
import DeleteProjectDialog from "./delete-project-dialog";
import { Project } from "@/types/project";
import { useUser, User } from "@/context/UserContext";
import ProjectMembersOnlyModal from "./project-members-only-modal";
import ProjectAdminModal from "./project-admin-modal";
import AddProjectMemberDialog from "./add-project-member-dialog";
import AddProjectAdminDialog from "./add-project-admin-dialog";

type Props = {
  organizationId: string;
  projects: Project[];
  orgAdmins?: User[];
  onDelete?: (projectId: string) => void;
};

const ProjectTable = ({
  organizationId,
  projects,
  orgAdmins,
  onDelete,
}: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managingMembersProject, setManagingMembersProject] =
    useState<Project | null>(null);
  const [managingAdminsProject, setManagingAdminsProject] =
    useState<Project | null>(null);
  const [addingMemberProject, setAddingMemberProject] =
    useState<Project | null>(null);
  const [addingAdminProject, setAddingAdminProject] = useState<Project | null>(
    null,
  );

  const handleView = (projectId: string) => {
    router.push(`/organizations/${organizationId}/${projectId}`);
  };

  const handleEdit = (projectId: string) => {
    setSelectedProjectId(projectId);
    setEditDialogOpen(true);
  };

  const handleDelete = (projectId: string, projectName: string) => {
    setError(null);
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (onDelete && selectedProjectId) {
      setIsDeleting(true);
      try {
        await onDelete(selectedProjectId);
        setDeleteDialogOpen(false);
      } catch (error: any) {
        console.error("Error deleting project:", error);
        setError(error.response?.data?.error || "Failed to delete project");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleManageMembers = (project: Project) => {
    setManagingMembersProject(project);
  };

  const handleManageAdmins = (project: Project) => {
    setManagingAdminsProject(project);
  };

  // Helper function to get quota value by resource type
  const getQuotaByType = (project: Project, type: string): number | null => {
    if (!project.resource_quotas || project.resource_quotas.length === 0) {
      return null;
    }
    const quota = project.resource_quotas.find(
      (q) => q.type.toUpperCase() === type.toUpperCase(),
    );
    return quota ? quota.quota : null;
  };

  const columns = [
    { key: "name", label: "PROJECT NAME" },
    // { key: "cpu", label: "CPU" },
    // { key: "gpu", label: "GPU" },
    // { key: "ram", label: "RAM" },
    { key: "quotas", label: "QUOTAS" },
    { key: "members", label: "MEMBERS" },
    { key: "admins", label: "ADMINS" },
    { key: "actions", label: "ACTIONS" },
  ];

  return (
    <>
      <div className="w-full">
        <Table
          aria-label="Projects table"
          className="min-w-full"
          classNames={{
            wrapper: "shadow-md rounded-lg",
            th: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold",
            td: "py-4",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="uppercase text-xs">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FolderOpenRounded className="!w-5 !h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 flex-wrap">
                    {!project.resource_quotas ||
                    project.resource_quotas.length === 0 ? (
                      <Chip
                        size="sm"
                        color="warning"
                        variant="flat"
                        className="cursor-pointer hover:bg-warning-200 dark:hover:bg-warning-800 transition-colors font-medium"
                        onClick={() =>
                          router.push(
                            `/organizations/${organizationId}/${project.id}/quotas`,
                          )
                        }
                      >
                        <span className="font-medium">
                          No quotas - Click to set
                        </span>
                      </Chip>
                    ) : (
                      <>
                        {getQuotaByType(project, "CPU") !== null && (
                          <Chip
                            size="sm"
                            color="primary"
                            variant="flat"
                            className="font-medium"
                          >
                            <span className="font-medium">
                              CPU: {getQuotaByType(project, "CPU")} Core
                            </span>
                          </Chip>
                        )}
                        {getQuotaByType(project, "GPU") !== null && (
                          <Chip
                            size="sm"
                            color="secondary"
                            variant="flat"
                            className="font-medium"
                          >
                            <span className="font-medium">
                              GPU: {getQuotaByType(project, "GPU")} GiB
                            </span>
                          </Chip>
                        )}
                        {getQuotaByType(project, "RAM") !== null && (
                          <Chip
                            size="sm"
                            color="success"
                            variant="flat"
                            className="font-medium"
                          >
                            <span className="font-medium">
                              RAM: {getQuotaByType(project, "RAM")} GiB
                            </span>
                          </Chip>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color="success"
                    variant="flat"
                    className="px-2 cursor-pointer hover:bg-success-200 dark:hover:bg-success-800 transition-colors"
                    onClick={() => handleManageMembers(project)}
                  >
                    <PeopleAltRounded className="!w-4 !h-4 mr-1" />
                    <span className="font-medium dark:text-green-600">
                      {project.members.length}
                    </span>
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="px-2 cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                    onClick={() => handleManageAdmins(project)}
                  >
                    <AdminPanelSettingsRounded className="!w-4 !h-4" />
                    <span className="font-medium dark:text-primary-600">
                      {project.admins.length}
                    </span>
                  </Chip>
                </TableCell>
                <TableCell>
                  {user &&
                  project.admins.some((admin) => admin.id === user.id) ? (
                    // Admin: can view, edit, and delete
                    <div className="flex items-center gap-2">
                      <Tooltip
                        content="View details"
                        className="dark:text-white"
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          aria-label="View project"
                          onPress={() => handleView(project.id)}
                        >
                          <VisibilityRounded className="!w-4 !h-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content="Edit project"
                        className="dark:text-white"
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="warning"
                          aria-label="Edit project"
                          onPress={() => handleEdit(project.id)}
                        >
                          <EditRounded className="!w-4 !h-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip
                        content="Delete project"
                        className="dark:text-white"
                      >
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          aria-label="Delete project"
                          onPress={() => handleDelete(project.id, project.name)}
                        >
                          <DeleteRounded className="!w-4 !h-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  ) : user &&
                    project.members.some((member) => member.id === user.id) ? (
                    // Member: can only view
                    <Tooltip content="View details" className="dark:text-white">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        aria-label="View project"
                        onPress={() => handleView(project.id)}
                      >
                        <VisibilityRounded className="!w-4 !h-4" />
                      </Button>
                    </Tooltip>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      No actions available
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {editDialogOpen && (
        <UpdateProjectDialog
          projectId={selectedProjectId}
          organizationId={organizationId}
          setOnClose={() => setEditDialogOpen(false)}
        />
      )}
      <DeleteProjectDialog
        isOpen={deleteDialogOpen}
        projectName={selectedProjectName}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        error={error}
      />
      {managingMembersProject && (
        <ProjectMembersOnlyModal
          isOpen={true}
          setOpenModal={(open) => {
            if (!open) setManagingMembersProject(null);
          }}
          members={managingMembersProject.members}
          admins={managingMembersProject.admins}
          projectId={managingMembersProject.id}
          orgId={organizationId}
          onAddMember={() => {
            setAddingMemberProject(managingMembersProject);
            setManagingMembersProject(null);
          }}
        />
      )}
      {managingAdminsProject && (
        <ProjectAdminModal
          isOpen={true}
          setOpenModal={(open) => {
            if (!open) setManagingAdminsProject(null);
          }}
          admins={managingAdminsProject.admins}
          projectId={managingAdminsProject.id}
          orgId={organizationId}
          onAddAdmin={() => {
            setAddingAdminProject(managingAdminsProject);
            setManagingAdminsProject(null);
          }}
        />
      )}
      {addingMemberProject && (
        <AddProjectMemberDialog
          key={`add-member-${addingMemberProject.id}`}
          projectId={addingMemberProject.id}
          orgId={organizationId}
          onClose={() => {
            setManagingMembersProject(addingMemberProject);
            setAddingMemberProject(null);
          }}
          existingMembers={addingMemberProject.members}
          admins={addingMemberProject.admins}
        />
      )}
      {addingAdminProject && (
        <AddProjectAdminDialog
          key={`add-admin-${addingAdminProject.id}`}
          projectId={addingAdminProject.id}
          orgId={organizationId}
          onClose={() => {
            setManagingAdminsProject(addingAdminProject);
            setAddingAdminProject(null);
          }}
          existingAdmins={addingAdminProject.admins}
          orgAdmins={orgAdmins}
        />
      )}
    </>
  );
};

export default ProjectTable;
