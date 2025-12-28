import ResourceTable from "@/components/resource-table";
import CreateResourceTypeDialog from "@/components/create-resource-type-dialog";
import CreateResourcePoolDialog from "@/components/create-resource-pool-dialog";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

const ResourcesPage = () => {
  return (
    <div className="container mx-auto pt-1 p-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Resource Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create resource types, manage pools, and allocate resources
          </p>
        </div>
        <div className="flex gap-2">
          <CreateResourceTypeDialog />
          <CreateResourcePoolDialog />
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <CardBody className="p-4">
          <h3 className="font-semibold mb-2">📋 Workflow</h3>
          <div className="flex flex-col md:flex-row gap-4 text-sm">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  1
                </span>
                <span className="font-semibold">Create Resource Types</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-8">
                Define types like CPU, GPU, RAM
              </p>
            </div>
            <Divider orientation="vertical" className="hidden md:block" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-success text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  2
                </span>
                <span className="font-semibold">Create Resource Pools</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-8">
                Create named pools (e.g., kmitl-pool)
              </p>
            </div>
            <Divider orientation="vertical" className="hidden md:block" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  3
                </span>
                <span className="font-semibold">Add Resources</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-8">
                Add resources with price & limits
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Resource Pools Section */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          Resource Pools
        </h2>
        <ResourceTable />
      </div>
    </div>
  );
};

export default ResourcesPage;
