// External Dependencies
import { ChevronUp } from "lucide-react";

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
  const handleSendPrompt = (e: Event, prompt: string) => {
    e.preventDefault();
    console.log("prompt is", prompt);
  };

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
            onSelect={(e) => handleSendPrompt(e, "Explain this error")}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <p>Explain this error</p>
              <EditPromptModal existingPrompt={"Explain this error"} />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => handleSendPrompt(e, "Explain these lines of code")}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <p>Explain these lines of code</p>
              <EditPromptModal existingPrompt={"Explain these lines of code"} />
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <CreatePromptModal />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MessagePromptsMenu;
