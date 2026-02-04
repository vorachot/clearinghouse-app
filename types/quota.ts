import { S } from "@heroui/slider/dist/use-slider-BxNnx6bI";
import { Organization } from "./org";
import { Resource } from "./resource";

// Quota Resource Item
export type QuotaResource = {
  id: string;
  organization_quota_id?: string;
  project_quota_id?: string;
  namespace_quota_id?: string;
  quantity: number;
  resource_property_id: string;
  resource_prop: ResourceProp;
};

export type ResourceProp = {
  id: string;
  resource_id: string;
  resource: Resource;
  price: number;
  max_duration: number;
};

// Organization Quota (External - between organizations)
export type OrganizationQuota = {
  id: string;
  name: string;
  description: string;
  node_id: string;
  from_organization_id: string;
  to_organization_id: string;
  from_organization: Organization;
  to_organization: Organization;
  resources: QuotaResource[];
};

export type ProjectQuota = {
  id: string;
  name: string;
  description: string;
  organization_id: string;
  organization_quota_id?: string;
  project_id: string;
  node_id: string;
  resources: QuotaResource[];
};

// Namespace Quota
export type NamespaceQuota = {
  id: string;
  name: string;
  node_id: string;
  node_name: string;
  organization_name: string;
  project_id: string;
  resources: QuotaResource[];
};

// Namespace Quota Template
export type NamespaceQuotaTemplate = {
  id: string;
  name: string;
  description: string;
  project_id: string;
  quotas: QuotaTemplate[];
};
export type QuotaTemplate = {
  id: string;
  name: string;
  description: string;
  project_id: string;
  project_quota_id: string;
  node_id: string;
  resources: QuotaResource[];
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
  project_id: string;
  org_quota_id: string;
  org_id: string;
  node_id: string;
  resources: {
    quantity: number;
    resource_id: string;
    price: number;
    duration: number;
  }[];
};

export type CreateProjectQuotaInternalDTO = {
  name: string;
  description: string;
  org_id: string;
  node_id: string;
  project_id: string;
  resources: {
    quantity: number;
    resource_id: string;
    price: number;
    duration: number;
  }[];
};

export type CreateNamespaceQuotaDTO = {
  name: string;
  description: string;
  project_id: string;
  project_quota_id: string;
  node_id: string;
  resources: {
    resource_id: string;
    quantity: number;
  }[];
};

export type CreateQuotaTemplateDTO = {
  name: string;
  description: string;
  project_id: string;
  quota_ids: string[];
};

export type UpdateQuotaTemplateDTO = {
  name: string;
  description: string;
  quota_ids: string[];
};

export type AssignTemplateToNamespacesDTO = {
  namespaces: string[];
  project_id: string;
  quota_template_id: string;
};

export type QuotaUsage = {
  usage: ResourceUsage[];
};

export type ResourceUsage = {
  type_id: string;
  type: string;
  quota: number;
  usage: number;
};
