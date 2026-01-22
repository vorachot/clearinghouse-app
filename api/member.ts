import apiClient from "@/utils/apiClient";

export async function getMembers(): Promise<any> {
  const response = await apiClient.get(`organizations/members`);
  return response.data;
}

export async function addMembersToOrganization(memberData: {
  organization_id: string;
  members: string[];
}): Promise<Response> {
  const response = await apiClient.post(`organizations/members`, memberData);
  if (response.status !== 200) {
    throw new Error("Failed to add member to organization");
  }
  return response.data;
}

export async function removeMembersFromOrganization(memberData: {
  organization_id: string;
  members: string[];
}): Promise<Response> {
  const response = await apiClient.post(`organizations/rm-members`, memberData);
  if (response.status !== 200) {
    throw new Error("Failed to remove member from organization");
  }
  return response.data;
}

export async function getOrganizationMembers(orgId: string): Promise<any> {
  const response = await apiClient.get(`organizations/${orgId}/members`);
  return response.data;
}

export async function getProjectMembers(projectId: string): Promise<any> {
  const response = await apiClient.get(`projects/${projectId}/members`);
  return response.data;
}

export async function addMembersToProject(memberData: {
  project_id: string;
  members: string[];
}): Promise<any> {
  const response = await apiClient.post(`projects/members`, memberData);
  if (response.status !== 200) {
    throw new Error("Failed to add member to project");
  }
  return response.data;
}

export async function removeMembersFromProject(memberData: {
  project_id: string;
  members: string[];
}): Promise<any> {
  const response = await apiClient.post(`projects/rm-members`, memberData);
  if (response.status !== 200) {
    throw new Error("Failed to remove member from project");
  }
  return response.data;
}

export async function addMembersToNamespace(memberData: {
  namespace_id: string;
  members: string[];
}): Promise<any> {
  const response = await apiClient.post(`namespaces/members`, memberData);
  if (response.status !== 200) {
    throw new Error("Failed to add member to namespace");
  }
  return response.data;
}

export async function removeMembersFromNamespace(memberData: {
  namespace_id: string;
  members: string[];
}): Promise<any> {
  const response = await apiClient.post(`namespaces/rm-members`, memberData);
  if (response.status !== 200) {
    throw new Error("Failed to remove member from namespace");
  }
  return response.data;
}