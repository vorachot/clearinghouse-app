import apiClient from "@/utils/apiClient";

export async function createOrganization(orgData: {
  name: string;
}): Promise<Response> {
  const response = await apiClient.post(`/organizations/`, orgData);

  if (response.status !== 201) {
    throw new Error("Failed to create organization");
  }

  return response.data;
}

export async function getOrganizations(): Promise<any[]> {
  const response = await apiClient.get(`/organizations/`);
  return response.data;
}

export async function getOrganizationById(id: string): Promise<any> {
  const response = await apiClient.get(`/organizations/${id}`);
  return response.data;
}

export async function addMemberToOrg(memberData: {
  organization_id: string;
  members: string[];
}) {
  const response = await apiClient.post(`/organizations/members`, memberData);

  if (response.status !== 201) {
    throw new Error("Failed to add member to organization");
  }

  return response.data;
}
