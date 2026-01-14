import {
  AssignTemplateToNamespacesDTO,
  CreateNamespaceQuotaDTO,
  CreateOrganizationQuotaDTO,
  CreateProjectQuotaDTO,
  CreateProjectQuotaInternalDTO,
  CreateQuotaTemplateDTO,
} from "@/types/quota";
import apiClient from "@/utils/apiClient";

export async function getOrgQuotasByOrgId(orgId: string): Promise<any> {
  const response = await apiClient.get(`/quota/organization/${orgId}`);
  return response.data;
}

export async function createOrgQuota(
  orgQuotaData: CreateOrganizationQuotaDTO
): Promise<Response> {
  const response = await apiClient.post(`/quota/organization`, orgQuotaData);

  if (response.status !== 201) {
    throw new Error("Failed to create organization quota");
  }

  return response.data;
}

export async function getProjectQuotasByProjectId(
  projectId: string
): Promise<any> {
  const response = await apiClient.get(`/quota/project/${projectId}`);
  return response.data;
}

export async function createProjectQuota(
  projectQuotaData: CreateProjectQuotaDTO
): Promise<Response> {
  const response = await apiClient.post(`/quota/project`, projectQuotaData);

  if (response.status !== 201) {
    throw new Error("Failed to create project quota");
  }

  return response.data;
}

export async function createProjectQuotaInternal(
  projectQuotaData: CreateProjectQuotaInternalDTO
): Promise<Response> {
  const response = await apiClient.post(
    `/quota/project/internal`,
    projectQuotaData
  );

  if (response.status !== 201) {
    throw new Error("Failed to create project quota internally");
  }

  return response.data;
}

export async function getNamespaceQuotasByProjectId(projectId: string): Promise<any> {
  const response = await apiClient.get(`/quota/project/${projectId}/namespaces`);
  return response.data;
}

export async function getNamespaceQuotasByNamespaceId(namespaceId: string): Promise<any> {
  const response = await apiClient.get(`/quota/namespace/${namespaceId}`);
  return response.data;
}

export async function getNamespaceQuotaTemplatesByProjectId(projectId: string): Promise<any> {
  const response = await apiClient.get(`/quota/namespace/template/project/${projectId}`);
  return response.data;
}

export async function createNamespaceQuota(
  namespaceQuotaData: CreateNamespaceQuotaDTO
): Promise<Response> {
  const response = await apiClient.post(`/quota/namespace`, namespaceQuotaData);

  if (response.status !== 201) {
    throw new Error("Failed to create namespace quota");
  }

  return response.data;
}

export async function createNamespaceQuotaTemplate(
  namespaceQuotaTemplateData: CreateQuotaTemplateDTO
): Promise<Response> {
  const response = await apiClient.post(`/quota/namespace/template`, namespaceQuotaTemplateData);

  if (response.status !== 201) {
    throw new Error("Failed to create namespace quota");
  }

  return response.data;
}

export async function assignTemplateToNamespaces(
  assignData: AssignTemplateToNamespacesDTO
): Promise<Response> {
  const response = await apiClient.post(
    `/quota/namespace/template/assign`,
    assignData
  );

  if (response.status !== 204) {
    throw new Error("Failed to create namespace quota");
  }

  return response.data;
}

export async function getQuotaUsageByNamespaceId(quotaId: string, namespaceId: string): Promise<any> {
  const response = await apiClient.get(`/quota/${quotaId}/usage/${namespaceId}`);
  return response.data;
}