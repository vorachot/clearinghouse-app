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
  MemoryRounded as CpuIcon,
  GraphicEqRounded as GpuIcon,
  StorageRounded as RamIcon,
  VisibilityRounded,
  PeopleAltRounded,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import UpdateProjectDialog from "./update-project-dialog";
import DeleteProjectDialog from "./delete-project-dialog";
import { Project } from "@/types/project";
import { useUser } from "@/context/UserContext";

type Props = {
  organizationId: string;
  projects: Project[];
  onDelete?: (projectId: string) => void;
};

const ProjectTable = ({ organizationId, projects, onDelete }: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const columns = [
    { key: "name", label: "PROJECT NAME" },
    // { key: "cpu", label: "CPU" },
    // { key: "gpu", label: "GPU" },
    // { key: "ram", label: "RAM" },
    { key: "quotas", label: "QUOTAS" },
    { key: "members", label: "MEMBERS" },
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
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <CpuIcon className="!w-4 !h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium dark:text-blue-400">
                        16 Cores
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GpuIcon className="!w-4 !h-4 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium dark:text-purple-400">
                        32 GB
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RamIcon className="!w-4 !h-4 text-green-600 dark:text-green-400" />
                      <span className="font-medium dark:text-green-400">
                        128 GB
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    color="success"
                    variant="flat"
                    className="px-2"
                  >
                    <PeopleAltRounded className="!w-4 !h-4 mr-1" />
                    <span className="font-medium dark:text-green-400">
                      {project.members.length}
                    </span>
                  </Chip>
                </TableCell>
                <TableCell>
                  {user &&
                  project.admins.some((admin) => admin.id === user.id) ? (
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
    </>
  );
};

export default ProjectTable;
