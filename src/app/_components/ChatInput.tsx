"use client";
// External Dependencies
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { CircleStop, Paperclip, Send } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Messages } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// Relative Dependencies
import { Input } from "~/components/ui/input";
import { TextareaAutosize } from "~/components/ui/textarea-autosize";
import MessagePromptsMenu from "./MessagePromptsMenu";
import { cn, modelIDToChatEndpoint } from "~/lib/utils";

type Props = {
  changedModel: boolean;
  messageContainerRef: React.RefObject<HTMLDivElement>;
  setChangedModel: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Messages[] | null>>;
};

const ChatInput = ({
  changedModel,
  messageContainerRef,
  setChangedModel,
  setMessages,
}: Props) => {
  const router = useRouter();
  const { projectID, chatID } = useParams();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");

  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message?: string) => {
      if (!model) return;
      const chatEndpoint = modelIDToChatEndpoint(model);

      const response = await fetch(chatEndpoint, {
        method: "POST",
        body: JSON.stringify({
          message: message || userInput,
          chatID,
          projectID,
          model,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const reader = response.body?.getReader();
      return reader;
    },
    onSuccess: async (
      data: ReadableStreamDefaultReader<Uint8Array> | undefined,
    ) => {
      setUserInput("");
      let newMessage: Messages = {
        id: uuidv4(),
        created_at: new Date(),
        type: "assistant",
        content: "",
        chat_id: (chatID as string) ?? "",
      };
      const decoder = new TextDecoder();
      let firstPass = true;

      if (data) {
        while (true) {
          const { done, value } = await data.read();

          if (done) {
            break;
          }

          const decodedValue = decoder.decode(value, { stream: true });
          newMessage.content += decodedValue;

          if (value) {
            if (firstPass) {
              newMessage.content = decodedValue;
              setMessages((prev) => [...(prev as Messages[]), newMessage]);
              firstPass = false;
            } else {
              setMessages((prev: Messages[] | null) => {
                if (prev) {
                  const existingMessages = prev.slice(0, -1);
                  const lastMessage = prev[prev.length - 1] as Messages;
                  const updatedLastMessage = {
                    ...lastMessage,
                    content: lastMessage.content + decodedValue,
                  };
                  return [...existingMessages, updatedLastMessage];
                }
                return prev;
              });
            }
          }
        }
      }

      setIsGenerating(false);

      // Add new message to database
      // TODO: Handle error
      await fetch("/api/openai/add-response-message", {
        method: "POST",
        body: JSON.stringify(newMessage),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (changedModel) {
        setChangedModel(false);
        router.refresh();
      }
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

  const handleKeyPress = (e: React.KeyboardEvent<Element>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    setIsGenerating(true);
    updateUserMessageOptimistically();
    sendMessage(userInput);
  };

  const handleSendMessageWithPrompt = (prompt: string) => {
    setIsGenerating(true);
    const message = `${prompt}:\n${userInput}`;
    updateUserMessageOptimistically(prompt);
    sendMessage(message);
  };

  const updateUserMessageOptimistically = (prompt: string = "") => {
    // UUID will be different then created on the db but I don't think it matters
    let newUserQuestion: Messages = {
      id: uuidv4(),
      created_at: new Date(),
      type: "user",
      content: prompt !== "" ? `${prompt}:\n${userInput}` : userInput,
      chat_id: (chatID as string) ?? "",
    };

    setMessages((prev) => [...(prev as Messages[]), newUserQuestion]);

    if (messageContainerRef.current) {
      (
        messageContainerRef as React.MutableRefObject<HTMLDivElement>
      ).current.scrollTop = (
        messageContainerRef as React.MutableRefObject<HTMLDivElement>
      ).current.scrollHeight;
    }
  };

  return (
    <div className="mb-4 mt-auto flex w-4/5">
      <div className="relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2 border-input">
        <>
          {/* <Paperclip
            className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
            size={32}
            onClick={() => fileInputRef.current?.click()}
          /> */}

          {/* Hidden input to select files from device */}
          {/* <Input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={(e) => {
              if (!e.target.files) return;
              handleSelectDeviceFile(e.target.files[0]);
            }}
            accept={filesToAccept}
          /> */}
        </>

        <TextareaAutosize
          textareaRef={chatInputRef}
          className="text-md flex h-[40px] max-h-[100px] w-full resize-none rounded-md border-none bg-transparent py-2 pl-4 pr-20 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={`Send a message...`}
          onValueChange={handleInputChange}
          value={userInput}
          minRows={1}
          maxRows={18}
          onKeyDown={handleKeyPress}
          onPaste={() => {}}
          onCompositionStart={() => setIsTyping(true)}
          onCompositionEnd={() => setIsTyping(false)}
        />

        <div className="absolute bottom-[14px] right-3 ml-[2px] flex cursor-pointer flex-row gap-1">
          {isGenerating ? (
            <CircleStop
              className="animate-pulse rounded bg-transparent p-1 hover:bg-background"
              onClick={() => {}}
              size={30}
            />
          ) : (
            <Send
              className={cn(
                "rounded bg-primary p-1 text-secondary hover:opacity-50",
                !userInput && "cursor-not-allowed opacity-50",
              )}
              onClick={handleSendMessage}
              size={30}
            />
          )}
          <MessagePromptsMenu
            sendMessageWithPrompt={handleSendMessageWithPrompt}
            userInput={userInput}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
