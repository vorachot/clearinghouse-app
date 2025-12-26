import { Project } from "@/types/project";
import { User } from "@/context/UserContext";

export type Organization = {
  id: string;
  name: string;
  description: string;
  admins: string[];
  members: string[];
  projects: Project[];
  quotas: Quota[];
  given_quotas: string;
};

export type OrgDetail = {
  id: string;
  name: string;
  description: string;
  admins: User[];
  members: User[];
  projects: Project[];
  quotas: Quota[];
  given_quotas: string;
};

type Quota = {
  id: string;
} 