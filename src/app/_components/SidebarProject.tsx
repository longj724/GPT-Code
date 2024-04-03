"use client";

// Exernal Dependencies
import { ChevronDown, ChevronRight, Ellipsis, Plus } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Chats, Projects } from "@prisma/client";

// Relative Dependencies
import { cn } from "~/lib/utils";
import SidebarProjectChat from "./SidebarProjectChat";
import { Button } from "~/components/ui/button";

type Props = {
  project: Projects & {
    chats: Array<Chats>;
  };
};

const SidebarProject = ({ project }: Props) => {
  const { projectID } = useParams();
  const router = useRouter();
  const [projectOpen, setProjectOpen] = useState(false);

  const { mutate: createChat } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/openai/create-chat", {
        method: "POST",
        body: JSON.stringify({ projectID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Chats;
    },
    onSuccess: (data) => {
      router.push(`/chat/${data.project_id}/${data.id}`);
    },
  });

  const toggleProjectOpen = () => {
    setProjectOpen(!projectOpen);
  };

  const handleOptionsClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Implement handling options
  };

  const handleNewChat = () => {
    createChat();
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={cn(
          projectID === project.id && "bg-muted",
          "flex w-[90%] items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:cursor-pointer hover:bg-muted/40 hover:text-primary",
        )}
        onClick={toggleProjectOpen}
      >
        {projectOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        {project.name}
        <div
          className="ml-auto flex h-6 w-6 items-center justify-center"
          onClick={handleOptionsClick}
        >
          <Ellipsis className="hover:pointer rounded-sm hover:bg-gray-500" />
        </div>
      </div>
      {projectOpen && (
        <div className="my-1 flex w-[90%] flex-col gap-1">
          {project.chats?.map((chat, idx) => (
            <SidebarProjectChat projectID={project.id} chat={chat} key={idx} />
          ))}
          <div className={cn("ml-8 flex flex-row rounded-sm")}>
            <Button className="w-full" onClick={handleNewChat}>
              New Chat
              <Plus size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarProject;
