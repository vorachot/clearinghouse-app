import { User } from "@/context/UserContext";
import { NamespaceQuotaTemplate } from "./quota";

export type Namespace = {
  id: string;
  name: string;
  description: string;
  credit: number;
  project_id: string;
  organization_id: string;
  quota_template_id: string;
  quota_template: NamespaceQuotaTemplate;
  namespace_members: User[];
  owner_id: string;
  owner: User;
};