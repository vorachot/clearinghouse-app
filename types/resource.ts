// Resource Types
export type ResourceType = {
  id: string;
  name: string; // CPU, GPU, RAM
  description?: string;
  createdAt: string;
};

// Resource Pool
export type ResourcePool = {
  id: string;
  name: string;
  description?: string;
  organizationId?: string; // Optional during creation
  organizationName?: string;
  createdAt: string;
  resources?: Resource[];
};

// Resource (belongs to a pool)
export type Resource = {
  id: string;
  poolId: string;
  resourceTypeId: string;
  resourceTypeName: string; // CPU, GPU, RAM
  amount: number; // e.g., 100 for CPU cores
  unit: string; // Core, GB, etc.
  price: number; // price per hour
  maxDuration: number; // in hours
  createdAt: string;
};
