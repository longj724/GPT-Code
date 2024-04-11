"use client";
// External Dependencies
import { useParams } from "next/navigation";
import { CircleStop, Paperclip, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Messages } from "@prisma/client";

// Relative Dependencies
import { Input } from "~/components/ui/input";
import { TextareaAutosize } from "~/components/ui/textarea-autosize";
import { cn } from "~/lib/utils";

type Props = {};

const ChatInput = (props: Props) => {
  const { projectID, chatID } = useParams();
  const queryClient = useQueryClient();

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { mutate: sendMessage } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/openai/send-message", {
        method: "POST",
        body: JSON.stringify({ message: userInput, chatID, projectID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as { message: string };
    },
    onSuccess: () => {
      setIsGenerating(false);
      setUserInput("");
      queryClient.invalidateQueries({ queryKey: ["chat", chatID] });
    },
    onError: (error) => {
      // TODO: Display some message about handling error
    },
  });

  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (text: string) => {
    setUserInput(text);
  };

  const handleSendMessage = () => {
    setIsGenerating(true);
    sendMessage();
  };

  return (
    <div className="mb-4 mt-auto flex w-4/5">
      <div className="relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2 border-input">
        <>
          <Paperclip
            className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
            size={32}
            onClick={() => fileInputRef.current?.click()}
          />

          {/* Hidden input to select files from device */}
          <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={(e) => {
              if (!e.target.files) return;
              // handleSelectDeviceFile(e.target.files[0]);
            }}
            // accept={filesToAccept}
          />
        </>

        <TextareaAutosize
          textareaRef={chatInputRef}
          className="text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`Ask anything.`}
          onValueChange={handleInputChange}
          value={userInput}
          minRows={1}
          maxRows={18}
          onKeyDown={() => {}}
          onPaste={() => {}}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
          {isGenerating ? (
            <CircleStop
              className="animate-pulse rounded bg-transparent p-1 hover:bg-background"
              onClick={() => {}}
              size={30}
            />
          ) : (
            <Send
              className={cn(
                "rounded bg-primary p-1 text-secondary",
                !userInput && "cursor-not-allowed opacity-50",
              )}
              onClick={handleSendMessage}
              size={30}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
