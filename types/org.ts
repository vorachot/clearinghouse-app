import { User } from "@/context/UserContext";

export type Organization = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  admins: string[];
  members: string[];
  resource_quotas?: {
    type_id: string;
    type: string;
    quota: number;
  }[];
};

export type OrgDetail = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  admins: User[];
  members: User[];
  resource_quotas?: {
    type_id: string;
    type: string;
    quota: number;
  }[];
};