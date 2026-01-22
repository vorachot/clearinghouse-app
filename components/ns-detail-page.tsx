"use client";

import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { useState } from "react";
import useSWR from "swr";
import { getOrganizationById } from "@/api/org";
import { getProjectById } from "@/api/project";
import { Organization } from "@/types/org";
import { Project } from "@/types/project";
import { getNamespaceById } from "@/api/namespace";
import { Namespace } from "@/types/namespace";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";
import {
  PeopleAltRounded,
  PersonRounded,
  TollRounded,
} from "@mui/icons-material";
import NamespaceQuotaDisplay from "./namespace-quota-display";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { PersonAddRounded } from "@mui/icons-material";
import { getNamespaceQuotaTemplateById } from "@/api/quota";
import { NamespaceQuotaTemplate } from "@/types/quota";
import AddNamespaceMemberDialog from "./add-namespace-member-dialog";
import NamespaceMemberModal from "./namespace-member-modal";

const NamespaceDetailPage = () => {
  const params = useParams();
  const [openAddMember, setOpenAddMember] = useState(false);
  const [openMembersModal, setOpenMembersModal] = useState(false);

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
  const namespaceData = useSWR(
    ["namespace", namespaceId],
    () => getNamespaceById(namespaceId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );

  const organization: Organization = organizationData.data || {};
  const project: Project = projectData.data || {};
  const namespace: Namespace = namespaceData.data || {};

  const namespaceTemplateData = useSWR(
    namespace.quota_template_id != undefined
      ? ["namespace-template", namespace.quota_template_id]
      : null,
    () => getNamespaceQuotaTemplateById(namespace.quota_template_id!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Prevent duplicate requests for 5 seconds
    },
  );
  const namespaceTemplate: NamespaceQuotaTemplate =
    namespaceTemplateData.data || {};

  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Namespace Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            <span className="font-normal">for </span>
            <span className="font-semibold text-blue-600">
              {namespace?.name || "—"}
            </span>
            <span className="font-normal"> in </span>
            <span className="font-semibold text-blue-600">
              {project?.name || "—"}
            </span>
            <span className="font-normal"> of </span>
            <span className="font-semibold text-blue-600">
              {organization?.name || "—"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <TollRounded className="!w-5 !h-5 text-primary-600 dark:text-primary-400" />
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Credits:
            </span>
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {namespace?.credit !== undefined
                ? namespace.credit.toLocaleString()
                : "0"}
            </span>
          </div>
        </div>
      </div>

      <Tabs aria-label="Namespace details" size="lg">
        <Tab
          key="quotas"
          title={
            <div className="flex items-center gap-2">
              <span>Quotas</span>
            </div>
          }
        >
          <Card className="">
            <CardBody className="p-6">
              <NamespaceQuotaDisplay
                namespaceId={namespaceId}
                namespaceTemplate={namespaceTemplate}
              />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="members"
          title={
            <div className="flex items-center gap-2">
              <span>Members</span>
              <Chip size="sm" variant="flat">
                <PeopleAltRounded className="!w-4 !h-4 mr-1" />
                {namespace.namespace_members?.length || 0}
              </Chip>
            </div>
          }
        >
          <Card className="">
            <CardBody className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Namespace Members</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Members who have access to this namespace
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<PeopleAltRounded />}
                      onPress={() => setOpenMembersModal(true)}
                      isDisabled={
                        !namespace?.namespace_members ||
                        namespace.namespace_members.length === 0
                      }
                    >
                      Manage Members
                    </Button>
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      startContent={<PersonAddRounded />}
                      onPress={handleOpenAddMember}
                    >
                      Add Member
                    </Button>
                  </div>
                </div>
                <Divider />
                {namespace?.namespace_members &&
                namespace.namespace_members.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {namespace.namespace_members.slice(0, 6).map((member) => (
                        <Card
                          key={member.id}
                          className="border border-gray-200 dark:border-gray-700"
                        >
                          <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-full bg-success-100 dark:bg-success-900/30">
                                <PersonRounded className="!w-6 !h-6 text-success-600 dark:text-success-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                  {member.first_name} {member.last_name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Chip
                                size="sm"
                                color="success"
                                variant="flat"
                                className="w-full"
                              >
                                Member
                              </Chip>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <Card>
                    <CardBody className="p-8 text-center">
                      <p className="text-gray-500">No members found</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Add members to grant them access to this namespace
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {openAddMember && (
        <AddNamespaceMemberDialog
          namespaceId={namespaceId}
          projectId={projectId}
          onClose={handleCloseAddMember}
          existingMembers={namespace.namespace_members}
        />
      )}

      {openMembersModal && (
        <NamespaceMemberModal
          isOpen={openMembersModal}
          setOpenMembersModal={setOpenMembersModal}
          members={namespace.namespace_members}
          namespaceId={namespaceId}
        />
      )}
    </div>
  );
};
export default NamespaceDetailPage;
