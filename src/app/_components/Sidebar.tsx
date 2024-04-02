// External Dependencies
import Link from "next/link";
import { Package2 } from "lucide-react";

// Relative Dependencies
import ChatHeader from "./ChatHeader";
import { ModeToggle } from "./ModeToggle";
import SidebarProject from "./SidebarProject";
import CreateProjectModal from "./modals/CreateProjectModal";

export type SidebarProps = {
  children: React.ReactNode;
};

export interface IChat {
  name: string;
  model: string;
  id: string;
}

export interface IProject {
  name: string;
  chats: Array<IChat>;
}

const Sidebar = ({ children }: SidebarProps) => {
  // Will need to fetch these and pass down to sidebar item
  const projects: Array<IProject> = [
    {
      name: "Test Project",
      chats: [
        {
          name: "Test Chat",
          model: "Open AI",
          id: "12345",
        },
        {
          name: "Test Chat 2",
          model: "Open AI",
          id: "123456",
        },
      ],
    },
    {
      name: "Test Project 2",
      chats: [
        {
          name: "Test Chat 3",
          model: "Open AI",
          id: "123",
        },
      ],
    },
  ];

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Code GPT</span>
            </Link>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <nav className="mb-2 w-full">
              <div className="flex flex-row items-center">
                <h1 className="ml-4 text-xl">Projects</h1>
                <CreateProjectModal />
              </div>
            </nav>
            <div className="mt-4 flex w-full flex-col items-center gap-1">
              {projects.map((project) => (
                <SidebarProject project={project} />
              ))}
            </div>
          </div>

          <div className="mb-4 ml-4 align-bottom">
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <ChatHeader />
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
