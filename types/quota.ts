import { Organization } from "./org";
import { Resource } from "./resource";

// Quota Resource Item
export type QuotaResource = {
  id: string;
  organization_quota_id?: string;
  quantity: number;
  resource_property_id: string;
  resource_prop: ResourceProp;
};

export type ResourceProp = {
  id:string;
  resource_id:string;
  resource: Resource;
  price: number;
  max_duration: number;
}

// Organization Quota (External - between organizations)
export type OrganizationQuota = {
  id: string;
  name: string;
  description: string;
  node_id: string;
  from_organization_id: string;
  to_organization_id: string;
  from_organization: Organization
  to_organization: Organization
  resources: QuotaResource[];
};

// Project Quota Types
export type ProjectQuotaSource = "organization_quota" | "resource_pool";

export type ProjectQuota = {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  organizationId: string;
  organizationName: string;
  source: ProjectQuotaSource;
  sourceId: string; // Organization Quota ID or Resource Pool ID
  sourceName: string;
  nodeId: string;
  nodeName: string;
  resources: QuotaResource[];
  totalPrice: number;
  status: "active" | "inactive" | "expired";
  createdAt: string;
  updatedAt: string;
};

// Namespace Quota
export type NamespaceQuota = {
  id: string;
  name: string;
  description: string;
  namespaceId: string;
  namespaceName: string;
  projectId: string;
  projectName: string;
  projectQuotaId: string;
  projectQuotaName: string;
  nodeId: string;
  nodeName: string;
  resources: QuotaResource[];
  templateId?: string; // If created from template
  templateName?: string;
  createdAt: string;
  updatedAt: string;
};

// Namespace Quota Template
export type NamespaceQuotaTemplate = {
  id: string;
  name: string;
  description: string;
  projectId: string;
  projectName: string;
  sourceQuotaIds: string[]; // One or more namespace quotas used as source
  resources: QuotaResource[];
  createdAt: string;
  updatedAt: string;
};

// Namespace (for selection)
export type Namespace = {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  projectName?: string;
  createdAt: string;
};

// Form DTOs
export type CreateOrganizationQuotaDTO = {
  name: string;
  description: string;
  from_organization_id: string;
  to_organization_id: string;
  node_id: string;
  resources: {
    quantity: number;
    resource_id: string;
    price: number;
    duration: number;
  }[];
};

export type CreateProjectQuotaDTO = {
  name: string;
  description: string;
  projectId: string;
  source: ProjectQuotaSource;
  sourceId: string; // Org Quota ID or Resource Pool ID
  nodeId: string;
  resources: {
    resourceTypeId: string;
    quantity: number;
    price: number;
    duration: number;
  }[];
};

export type CreateNamespaceQuotaDTO = {
  name: string;
  description: string;
  projectId: string;
  projectQuotaId: string;
  nodeId: string;
  resources: {
    resourceTypeId: string;
    quantity: number;
  }[];
};

export type CreateQuotaTemplateDTO = {
  name: string;
  description: string;
  projectId: string;
  sourceQuotaIds: string[];
};

export type AssignTemplateToNamespacesDTO = {
  projectId: string;
  templateId: string;
  namespaceIds: string[];
};
