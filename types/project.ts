import { User } from "@/context/UserContext";

export type ResourceQuota = {
  type_id: string;
  type: string;
  quota: number;
};

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  organization_id: string;
  members: User[];
  admins: User[];
  resource_quotas?: ResourceQuota[];
};
