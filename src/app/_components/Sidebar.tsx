// External Dependencies
import Link from "next/link";
import { Package2 } from "lucide-react";
import { db } from "~/server/db";

// Relative Dependencies
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

const Sidebar = async ({ children }: SidebarProps) => {
  const projects = await db.projects.findMany();

  const projectsWithChats = await Promise.all(
    projects.map(async (project) => {
      const chats = await db.chats.findMany({
        where: {
          project_id: project.id,
        },
      });

      return {
        ...project,
        chats,
      };
    }),
  );

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
              {projectsWithChats.map((project) => (
                <SidebarProject project={project} key={project.id} />
              ))}
            </div>
          </div>

          <div className="mb-4 ml-4 align-bottom">
            <ModeToggle />
          </div>
        </div>
      </div>
      <div className="flex max-h-full flex-col">{children}</div>
    </div>
  );
};

export default Sidebar;
