"use client";

import Loading from "@/app/loading";
import useSWR from "swr";
import { getOrganizations } from "@/api/org";
import CreateOrgDialog from "@/components/create-org-dialog";
import OrganizationList from "@/components/org-list";
import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { HomeWorkRounded } from "@mui/icons-material";
import { Organization } from "@/types/org";

const OrganizationsPage = () => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleOpenCreateOrg = () => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  };
  const { data, error, isLoading } = useSWR(
    ["orgs"],
    () => getOrganizations(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    }
  );

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading organizations</div>;

  const organizations: Organization[] = data || [];

  if (organizations.length === 0) {
    return (
      <div className="container mx-auto pt-1 p-4 space-y-5">
        <div className="flex items-end justify-end gap-5">
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
        <Button
          size="sm"
          color="primary"
          className="gap-0"
          startContent={<AddIcon />}
          onPress={handleOpenCreateOrg}
        >
          Organization
        </Button>
      </div>

      <div className="h-full dark:text-white">
        <OrganizationList orgs={organizations} />
      </div>
      {open && <CreateOrgDialog setOnClose={onClose} />}
    </div>
  );
};
export default OrganizationsPage;
