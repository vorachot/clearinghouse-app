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
