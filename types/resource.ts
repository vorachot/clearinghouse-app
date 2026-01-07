export type ResourceType = {
  id: string;
  name: string;
  unit: string;
};

export type ResourcePool = {
  id: string;
  name: string;
  organization_id?: string;
  glidelet_urn: string;
  nodes?: ResourceNode[];
};

export type ResourceNode = {
  id: string;
  name: string;
  resource_pool_id: string;
  resources?: Resource[];
};

export type Resource = {
  id: string;
  name: string;
  quantity: number;
  resource_type_id: string;
  resource_type: ResourceType;
  node_id: string;
};
