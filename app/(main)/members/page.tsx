import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";

const MembersPage = () => {
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Members
        </h1>
        <Button
          size="sm"
          color="primary"
          className="gap-0"
          startContent={<AddIcon />}
        >
          {" "}
          Member
        </Button>
      </div>
      <div className="h-full dark:text-white">Member list coming soon...</div>
    </div>
  );
};
export default MembersPage;
