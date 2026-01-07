import { User } from "@/context/UserContext";

export type Project = {
  id: string;
  name: string;
  description: string;
  organization_id: string;
  members: User[];
  admins: User[];
};
