import apiClient from "@/utils/apiClient";

export async function getResourcePoolsByOrgId(orgId: string): Promise<any> {
  const response = await apiClient.get(`/resources/org/${orgId}`);
  return response.data;
}

export async function createResourceType(resourceTypeData: {
  name: string;
  unit: string;
}): Promise<Response> {
  const response = await apiClient.post(`/resources/type`, resourceTypeData);

  if (response.status !== 201) {
    throw new Error("Failed to create resource type");
  }

  return response.data;
}

export async function getResourceType(): Promise<any> {
  const response = await apiClient.get(`/resources/type`);
  return response.data;
}

export async function createResourcePool(resourcePoolData: {
  organization_id: string;
  name: string;
  glidelet_urn: string;
}): Promise<Response> {
  const response = await apiClient.post(`/resources/pool`, resourcePoolData);

  if (response.status !== 201) {
    throw new Error("Failed to create resource pool");
  }

  return response.data;
}

export async function getResourcePoolById(poolId: string): Promise<any> {
  const response = await apiClient.get(`/resources/pool/${poolId}`);
  return response.data;
}

export async function createResourceNode(resourceNodeData: {
  resource_pool_id: string;
  name: string;
}): Promise<Response> {
  const response = await apiClient.post(`/resources/node`, resourceNodeData);

  if (response.status !== 201) {
    throw new Error("Failed to create resource node");
  }

  return response.data;
}

export async function getResourceNodeById(nodeId: string): Promise<any> {
  const response = await apiClient.get(`/resources/node/${nodeId}`);
  return response.data;
}

export async function createResource(resourceData: {
  resource_node_id: string;
  resource_type_id: string;
  quantity: number;
  name: string;
}): Promise<Response> {
  const response = await apiClient.post(`/resources/`, resourceData);

  if (response.status !== 201) {
    throw new Error("Failed to create resource");
  }

  return response.data;
}

export async function getResourceById(resourceId: string): Promise<any> {
  const response = await apiClient.get(`/resources/${resourceId}`);
  return response.data;
}

export async function deleteResourcePool(resourcePoolId: string): Promise<any> {
  const response = await apiClient.delete(`/resources/pool/${resourcePoolId}`);

  if (response.status !== 200) {
    throw new Error("Failed to delete resource pool");
  }
  
  return response.data;
}
