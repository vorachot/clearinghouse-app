import { CreateOrganizationQuotaDTO, CreateProjectQuotaDTO, CreateProjectQuotaInternalDTO } from "@/types/quota";
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
  const response = await apiClient.post(`/quota/project/internal`, projectQuotaData);

  if (response.status !== 201) {
    throw new Error("Failed to create project quota internally");
  }

  return response.data;
}