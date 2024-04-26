// External Dependencies
import { Ellipsis } from "lucide-react";
import { useState } from "react";

// Relative Dependencies
import EditProjectContextModal from "./modals/EditProjectContextModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
  projectID: string;
};

const ProjectMenu = ({ projectID }: Props) => {
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Ellipsis className="hover:pointer rounded-sm hover:bg-gray-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <div onClick={() => setIsEditProjectOpen(true)}>
              Edit Project Context
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            Delete Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render Modals here */}
      <EditProjectContextModal
        isOpen={isEditProjectOpen}
        projectID={projectID}
        setIsOpen={setIsEditProjectOpen}
      />
    </>
  );
};

export default ProjectMenu;
