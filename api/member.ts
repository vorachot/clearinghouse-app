import apiClient from "@/utils/apiClient";

function normalizeMemberResponse(data: unknown): any[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const payload = data as {
    results?: unknown;
    members?: unknown;
    users?: unknown;
    data?: unknown;
    items?: unknown;
  };

  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.members)) return payload.members;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;

  return [];
}

function extractNextPage(data: unknown): number | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const payload = data as {
    next?: unknown;
    pagination?: { next_page?: unknown; page?: unknown; total_pages?: unknown };
    meta?: { next_page?: unknown; page?: unknown; total_pages?: unknown };
  };

  if (typeof payload.next === "number" && Number.isFinite(payload.next)) {
    return payload.next;
  }

  if (typeof payload.next === "string" && payload.next.length > 0) {
    try {
      const nextUrl = new URL(payload.next, "https://placeholder.local");
      const page = Number(nextUrl.searchParams.get("page"));
      if (Number.isFinite(page) && page > 0) {
        return page;
      }
    } catch {
      // Ignore invalid next URL shape and fallback to other pagination hints.
    }
  }

  const paginationCandidates = [payload.pagination, payload.meta];
  for (const pagination of paginationCandidates) {
    if (!pagination || typeof pagination !== "object") {
      continue;
    }

    if (
      typeof pagination.next_page === "number" &&
      Number.isFinite(pagination.next_page)
    ) {
      return pagination.next_page;
    }

    const page = Number(pagination.page);
    const totalPages = Number(pagination.total_pages);
    if (
      Number.isFinite(page) &&
      Number.isFinite(totalPages) &&
      page > 0 &&
      totalPages > page
    ) {
      return page + 1;
    }
  }

  return null;
}

async function fetchAllMembers(endpoint: string): Promise<any[]> {
  const pageSize = 100;
  const maxPages = 200;

  let page = 1;
  let hasMore = true;
  const allResults: any[] = [];

  while (hasMore && page <= maxPages) {
    const response = await apiClient.get(endpoint, {
      params: {
        page,
        page_size: pageSize,
        limit: pageSize,
      },
    });

    const batch = normalizeMemberResponse(response.data);
    allResults.push(...batch);

    const nextPage = extractNextPage(response.data);
    if (nextPage && nextPage > page) {
      page = nextPage;
      continue;
    }

    if (batch.length >= pageSize) {
      page += 1;
      continue;
    }

    hasMore = false;
  }

  // De-duplicate in case backend overlaps results between pages.
  return Array.from(new Map(allResults.map((member) => [member.id, member])).values());
}

export async function getMembers(): Promise<any> {
  return fetchAllMembers(`organizations/members`);
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
  return fetchAllMembers(`organizations/${orgId}/members`);
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

export async function addAdminToOrganization(adminData: {
  organization_id: string;
  admins: string[];
}): Promise<any> {
  const response = await apiClient.post(`organizations/admins`, adminData);

  if (response.status !== 200) {
    throw new Error("Failed to add admin to organization");
  }

  return response.data;
}

export async function removeAdminFromOrganization(adminData: {
  organization_id: string;
  admins: string[];
}): Promise<any> {
  const response = await apiClient.post(`organizations/rm-admins`, adminData);

  if (response.status !== 200) {
    throw new Error("Failed to remove admin from organization");
  }

  return response.data;
}

export async function addAdminToProject(adminData: {
  project_id: string;
  admins: string[];
}): Promise<any> {
  const response = await apiClient.post(`projects/admins`, adminData);

  if (response.status !== 200) {
    throw new Error("Failed to add admin to project");
  }

  return response.data;
}

export async function removeAdminFromProject(adminData: {
  project_id: string;
  admins: string[];
}): Promise<any> {
  const response = await apiClient.post(`projects/rm-admins`, adminData);
  if (response.status !== 200) {
    throw new Error("Failed to remove admin from project");
  }

  return response.data;
}