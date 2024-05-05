// External Dependencies
import Link from "next/link";
import { Edit, Package2 } from "lucide-react";
import { db } from "~/server/db";
import { currentUser } from "@clerk/nextjs";

// Relative Dependencies
import { ModeToggle } from "./ModeToggle";
import SidebarProject from "./SidebarProject";
import CreateProjectModal from "./modals/CreateProjectModal";
import Profile from "./Profile";
import EditApiKeysModal from "./modals/EditApiKeysModal";
import { cn } from "~/lib/utils";

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
  const user = await currentUser();

  const projects = await db.projects.findMany({
    where: {
      user_id: user?.id,
    },
  });

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
    <div className="grid min-h-screen w-full md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">GPT Code</span>
            </Link>
          </div>

          {user ? (
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
          ) : (
            <div className="flex-1"></div>
          )}

          <div className="mb-4 ml-4 flex flex-row items-center gap-1 align-bottom">
            {user && <Profile />}
            {user && <EditApiKeysModal />}
            <ModeToggle />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex max-h-full flex-col",
          !user && "items-center justify-center",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
