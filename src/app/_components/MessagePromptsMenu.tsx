// External Dependencies
import { ChevronUp, Send } from "lucide-react";

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
  const handleSendPrompt = (prompt: string) => {
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
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex w-full flex-row items-center gap-2">
              <p>Explain this error</p>
              <Send
                className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
                onClick={() => handleSendPrompt("Explain this error")}
                size={22}
              />
              <EditPromptModal existingPrompt={"Explain this error"} />
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
