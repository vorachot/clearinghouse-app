import apiClient from "@/utils/apiClient";

export async function createNamespace(namespaceData: {
  name: string;
  description: string;
  credit: number;
  project_id: string;
}): Promise<Response> {
  const response = await apiClient.post(`/namespaces/`, namespaceData);
  if (response.status !== 201) {
    throw new Error("Failed to create namespace");
  }

  return response.data;
}

export async function getNamespaceById(id: string): Promise<any> {
  const response = await apiClient.get(`/namespaces/${id}`);
  return response.data;
}

export async function getNamespaceByProjectId(projectId: string): Promise<any> {
  const response = await apiClient.get(`/namespaces/project/${projectId}`);
  return response.data;
}

export async function updateNamespace(namespaceData: {
  namespace_id: string;
  name?: string;
  description?: string;
  credit?: number;
}): Promise<any> {
  const response = await apiClient.put(`/namespaces/`, namespaceData);

  if (response.status !== 200) {
    throw new Error("Failed to update namespace");
  }

  return response.data;
}

export async function deleteNamespace(id: string): Promise<any> {
  const response = await apiClient.delete(`/namespaces/${id}`);

  if (response.status !== 200) {
    throw new Error("Failed to delete namespace");
  }
  
  return response.data;
}
