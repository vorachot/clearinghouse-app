import apiClient from "@/utils/apiClient";

export async function createProject(projectData: {
  organization_id: string;
  name: string;
}): Promise<Response> {
  const response = await apiClient.post(`/projects/`, projectData);

  if (response.status !== 201) {
    throw new Error("Failed to create organization");
  }

  return response.data;
}

export async function getProjectById(id: string): Promise<any> {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data;
}

export async function getProjectsByOrgId(orgId: string): Promise<any> {
  const response = await apiClient.get(`/projects/organization/${orgId}`);
  return response.data;
}

export async function updateProject(projectData: {
  project_id: string;
  name: string;
  description: string;
}): Promise<any> {
  const response = await apiClient.put(`/projects/`, projectData);

  if (response.status !== 200) {
    throw new Error("Failed to update project");
  }
  
  return response.data;
}
