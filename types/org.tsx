type Organization = {
  id: string;
  name: string;
  description: string;
  admins: string[];
  members: string[];
  projects: string[];
  quotas: string[];
  given_quotas: string;
};

type Project = {
  id: string;
  name: string;
};

type Quota = {
  id: string;
} 