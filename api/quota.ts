import { CreateOrganizationQuotaDTO } from "@/types/quota";
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
    throw new Error("Failed to create resource type");
  }

  return response.data;
}
