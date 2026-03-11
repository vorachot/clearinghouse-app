"use client";

import Loading from "@/app/loading";
import useSWR from "swr";
import { getOrganizations } from "@/api/org";
import CreateOrgDialog from "@/components/create-org-dialog";
import UpdateOrgDialog from "@/components/update-org-dialog";
import DeleteOrgDialog from "@/components/delete-org-dialog";
import OrganizationList from "@/components/org-list";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { HomeWorkRounded } from "@mui/icons-material";
import { OrgDetail } from "@/types/org";
import { useUser } from "@/context/UserContext";

const OrganizationsPage = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenCreateOrg = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };

  const handleEditOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedOrgId(null);
  };

  const handleDeleteOrg = (orgId: string) => {
    setSelectedOrgId(orgId);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedOrgId(null);
  };
  const { data, error, isLoading } = useSWR(
    ["orgs"],
    () => getOrganizations(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  if (isLoading) return <Loading />;

  const organizations: OrgDetail[] = data || [];
  const is401 = error?.status === 401 || error?.response?.status === 401;

  if (organizations.length === 0 || is401) {
    return (
      <div className="container mx-auto pt-1 p-4 space-y-5">
        <div className="flex items-end justify-end gap-5">
          {user?.is_super_admin && (
            <Button
              size="sm"
              color="primary"
              className="gap-0"
              startContent={<AddIcon />}
              onPress={handleOpenCreateOrg}
            >
              {" "}
              Organization
            </Button>
          )}
        </div>
        <div className="h-[400px] flex flex-col justify-center items-center text-center opacity-50">
          <HomeWorkRounded className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No Available Organizations
          </h3>
        </div>
        {open && <CreateOrgDialog setOnClose={onClose} />}
      </div>
    );
  }
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        {" "}
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Organizations
        </h1>
        {user?.is_super_admin && (
          <Button
            size="sm"
            color="primary"
            className="gap-0"
            startContent={<AddIcon />}
            onPress={handleOpenCreateOrg}
          >
            Organization
          </Button>
        )}
      </div>

      <div className="h-full dark:text-white">
        <OrganizationList
          orgs={organizations}
          onEdit={handleEditOrg}
          onDelete={handleDeleteOrg}
        />
      </div>
      {open && <CreateOrgDialog setOnClose={onClose} />}
      {editOpen && selectedOrgId && (
        <UpdateOrgDialog orgId={selectedOrgId} setOnClose={handleCloseEdit} />
      )}
      {deleteOpen && selectedOrgId && (
        <DeleteOrgDialog orgId={selectedOrgId} setOnClose={handleCloseDelete} />
      )}
    </div>
  );
};
export default OrganizationsPage;
