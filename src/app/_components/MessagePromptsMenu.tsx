// External Dependencies
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ChevronUp, FilePenLine, Send, SquarePlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { type Prompts } from "@prisma/client";

// Relative Dependencies
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import CreatePromptModal from "./modals/CreatePromptModal";
import EditPromptModal from "./modals/EditPromptModal";

type Props = {
  sendMessageWithPrompt: (prompt: string) => void;
  userInput: string;
};

const MessagePromptsMenu = ({ userInput, sendMessageWithPrompt }: Props) => {
  const { user } = useUser();
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false);
  const [isEditPromptOpen, setIsEditPromptOpen] = useState(false);
  const [selectedPromptToEdit, setSelectedPromptToEdit] = useState<string>("");

  const { data: prompts } = useQuery({
    queryKey: ["prompts", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/user/prompts?user_id=${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()).prompts as Prompts[];
    },
  });

  const handleEditPrompt = (prompt: string) => {
    setSelectedPromptToEdit(prompt);
  };

  useEffect(() => {
    if (selectedPromptToEdit !== "") {
      setIsEditPromptOpen(true);
    }
  }, [selectedPromptToEdit]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ChevronUp
            className={cn(
              "rounded bg-primary p-1 text-secondary hover:opacity-50",
              !userInput && "cursor-not-allowed opacity-50",
            )}
            size={30}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {prompts?.map(({ content }) => (
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <div className="flex w-full flex-row items-center gap-2">
                <p>{content}</p>
                <Send
                  className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                  onClick={() => sendMessageWithPrompt(content)}
                  size={22}
                />
                <div
                  className="flex flex-row items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FilePenLine
                    size={22}
                    className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                    onClick={() => handleEditPrompt(content)}
                  />
                </div>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <p>Create Prompt</p>
              <SquarePlus
                size={22}
                className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                onClick={() => setIsCreatePromptOpen(true)}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render Modals here */}
      <CreatePromptModal
        open={isCreatePromptOpen}
        setOpen={setIsCreatePromptOpen}
        userID={user?.id!}
      />
      {prompts?.map(({ id }) => (
        <EditPromptModal
          existingPrompt={selectedPromptToEdit}
          isOpen={isEditPromptOpen}
          promptID={id}
          setIsOpen={setIsEditPromptOpen}
          userID={user?.id!}
        />
      ))}
    </>
  );
};

export default MessagePromptsMenu;
