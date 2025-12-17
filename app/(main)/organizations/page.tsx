import OrganizationList from "@/components/org-list";

const OrganizationsPage = () => {
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
        Organizations
      </h1>
      <div className="h-full dark:text-white">
        <OrganizationList />
      </div>
    </div>
  );
};
export default OrganizationsPage;
