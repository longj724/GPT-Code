// External Dependencies
import { useEffect, useState } from "react";
import { ChevronUp, FilePenLine, Send, SquarePlus } from "lucide-react";

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

const MessagePromptsMenu = ({ userInput }: Props) => {
  const [isCreatePromptOpen, setIsCreatePromptOpen] = useState(false);
  const [isEditPromptOpen, setIsEditPromptOpen] = useState(false);
  const [selectedPromptToEdit, setSelectedPromptToEdit] = useState<string>("");

  const handleSendPrompt = (prompt: string) => {};

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
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <p>Explain this error</p>
              <Send
                className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                onClick={() => handleSendPrompt("Explain this error")}
                size={22}
              />
              <div
                className="flex flex-row items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <FilePenLine
                  size={22}
                  className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                  onClick={() => handleEditPrompt("Explain this error")}
                />
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <p>Explain these lines of code</p>
              <Send
                className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                onClick={() => handleSendPrompt("Explain these lines of code")}
                size={22}
              />
              <div
                className="flex flex-row items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <FilePenLine
                  size={22}
                  className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                  onClick={() =>
                    handleEditPrompt("Explain these lines of code")
                  }
                />
              </div>
            </div>
          </DropdownMenuItem>
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
      />
      <EditPromptModal
        existingPrompt={selectedPromptToEdit}
        isOpen={isEditPromptOpen}
        setIsOpen={setIsEditPromptOpen}
      />
    </>
  );
};

export default MessagePromptsMenu;
