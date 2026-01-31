"use client";

import ResourceTable from "@/components/resource-table";
import CreateResourceTypeDialog from "@/components/create-resource-type-dialog";
import CreateResourcePoolDialog from "@/components/create-resource-pool-dialog";
import useSWR from "swr";
import { useParams } from "next/navigation";
import {
  getResourcePoolsByOrgId,
  deleteResourcePool,
  deleteResourceNode,
  deleteResource,
} from "@/api/resource";
import Loading from "@/app/loading";
import { ResourcePool } from "@/types/resource";
import { Inventory2Outlined } from "@mui/icons-material";

const ResourcesPage = () => {
  const params = useParams();
  const { orgId } = params as { orgId: string };
  const resourcePoolsData = useSWR(
    ["resourcePools", orgId],
    () => getResourcePoolsByOrgId(orgId),
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    },
  );
  if (resourcePoolsData.isLoading) return <Loading />;
  if (resourcePoolsData.error) return <div>Error loading resources</div>;

  const handleDeleteResourcePool = async (poolId: string) => {
    try {
      await deleteResourcePool(poolId);
      // Revalidate the resource pools data to refresh the list
      resourcePoolsData.mutate();
    } catch (error) {
      console.error("Failed to delete resource pool:", error);
      throw error;
    }
  };

  const handleDeleteResourceNode = async (nodeId: string) => {
    try {
      await deleteResourceNode(nodeId);
      // Revalidate the resource pools data to refresh the list
      resourcePoolsData.mutate();
    } catch (error) {
      console.error("Failed to delete resource node:", error);
      throw error;
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await deleteResource(resourceId);
      // Revalidate the resource pools data to refresh the list
      resourcePoolsData.mutate();
    } catch (error) {
      console.error("Failed to delete resource:", error);
      throw error;
    }
  };
  const resourcePools: ResourcePool[] = resourcePoolsData.data || [];
  return (
    <div className="container mx-auto pt-1 p-4 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Resource Pools Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create resource types, manage pools, create nodes, and allocate
            resources
          </p>
        </div>
        <div className="flex gap-2">
          <CreateResourceTypeDialog />
          <CreateResourcePoolDialog orgId={orgId} />
        </div>
      </div>

      {/* Info Card */}
      {/* <Card>
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
                <span className="font-semibold">Create Nodes</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-8">
                Add nodes to pools (e.g., node-01)
              </p>
            </div>
            <Divider orientation="vertical" className="hidden md:block" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-warning text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  4
                </span>
                <span className="font-semibold">Add Resources</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 ml-8">
                Add resources to nodes with limits
              </p>
            </div>
          </div>
        </CardBody>
      </Card> */}

      {/* Resource Pools Section */}
      <div>
        {resourcePools.length === 0 && (
          <div className="h-[200px] flex flex-col justify-center items-center text-center opacity-50">
            <Inventory2Outlined className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No Available Resource Pools in this Organization
            </h3>
          </div>
        )}
        <ResourceTable
          resourcePools={resourcePools}
          onDelete={handleDeleteResourcePool}
          onDeleteNode={handleDeleteResourceNode}
          onDeleteResource={handleDeleteResource}
        />
      </div>
    </div>
  );
};

export default ResourcesPage;
