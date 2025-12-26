import { HomeWorkRounded } from "@mui/icons-material";
import OrgInfoCard from "./org-info-card";
import { Organization } from "@/types/org";

// const orgs = [
//   { id: '1', name: 'King Mongkut\'s Institute of Technology Ladkrabang' },
//   { id: '2', name: 'King Mongkut\'s University of Technology Thonburi' },
//   { id: '3', name: 'Chulalongkorn University' },
// ]

const OrganizationList = ({ orgs }: { orgs: Organization[] }) => {
  if (orgs.length === 0) {
    return (
      <div className="h-[500px] flex flex-col justify-center items-center text-center opacity-50">
        <HomeWorkRounded className="!w-16 !h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No Available Organizations
        </h3>
      </div>
    );
  }
  return (
    <div className="flex gap-4 flex-wrap">
      {orgs.map((org, index) => (
        <OrgInfoCard
          key={index}
          aria-label={`Organization ${org.name}`}
          id={org.id}
          name={org.name}
        />
      ))}
    </div>
  );
}
export default OrganizationList