import OrganizationList from "@/components/org-list";

const OrganizationsPage = () => {
  return (
    <div className="flex flex-col justify-center gap-7">
      <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">
        Your Organizations
      </h1>
      <div className="h-full dark:text-white">
        <OrganizationList />
      </div>
    </div>
  );
};
export default OrganizationsPage;
