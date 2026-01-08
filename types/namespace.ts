import { User } from "@/context/UserContext";

export type Namespace = {
  id: string;
  name: string;
  description: string;
  credit: number;
  project_id: string;
  organization_id: string;
  quota_template_id?: string;
  quota_template: string;
  namespace_members: User[];
  owner: User[];
};