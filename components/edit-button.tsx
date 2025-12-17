import { EditRounded as EditIcon } from "@mui/icons-material";

const EditButton = ({
  onClick,
}: {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  return (
    <button
      className="border-0 p-0 min-h-0 min-w-0 h-6 w-6 hover:bg-gray-200 dark:hover:bg-blue-700 rounded-md flex items-center justify-center cursor-pointer transition-colors"
      onClick={onClick}
    >
      <EditIcon className="!text-[14px] text-gray-600 dark:text-white" />
    </button>
  );
};
export default EditButton;
