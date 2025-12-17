import { Button } from "@heroui/button";
import AddIcon from "@mui/icons-material/Add";

const QuotasPage = () => {
  return (
    <div className="container mx-auto pt-1 p-4 space-y-5">
      <div className="flex items-end justify-between gap-5">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Quotas
        </h1>
        <Button
          size="sm"
          color="primary"
          className="gap-0"
          startContent={<AddIcon />}
        >
          {" "}
          Quota
        </Button>
      </div>
      <div className="h-full dark:text-white">Quota list coming soon...</div>
    </div>
  );
};
export default QuotasPage;
