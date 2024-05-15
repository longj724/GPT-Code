"use client";
// External Dependencies
import { useRef, useState } from "react";
import { Messages } from "@prisma/client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Relative Dependencies
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatHeader from "./ChatHeader";

type Props = {};

const ChatArea = (props: Props) => {
  const { chatID } = useParams();
  const [messages, setMessages] = useState<Messages[] | null>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const [changedModel, setChangedModel] = useState<boolean>(false);

  useQuery({
    queryKey: ["chat", chatID],
    enabled: !!chatID,
    queryFn: async () => {
      console.log("here");
      const response = await fetch(`/api/get-messages?chat_id=${chatID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("response", response);

      const allMessages = (await response.json()).messages as Messages[];
      setMessages(allMessages);
      return allMessages;
    },
  });

  return (
    <div className="flex h-full max-h-screen w-full flex-col items-center">
      <ChatHeader
        showSelectedModel={messages !== null && messages?.length !== 0}
      />
      <ChatMessages
        messages={messages}
        ref={chatMessagesRef}
        setChangedModel={setChangedModel}
      />
      <ChatInput
        changedModel={changedModel}
        messageContainerRef={chatMessagesRef}
        setChangedModel={setChangedModel}
        setMessages={setMessages}
      />
    </div>
  );
};

export default ChatArea;
