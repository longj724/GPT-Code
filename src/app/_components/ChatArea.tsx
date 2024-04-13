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
  const [messages, setMessages] = useState<Messages[]>([]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  useQuery({
    queryKey: ["chat", chatID],
    enabled: !!chatID,
    queryFn: async () => {
      const response = await fetch(`/api/get-messages?chat_id=${chatID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const allMessages = (await response.json()).messages as Messages[];
      setMessages(allMessages);
      return allMessages;
    },
  });

  return (
    <div className="flex h-full max-h-screen w-full flex-col items-center">
      <ChatHeader />
      <ChatMessages messages={messages} ref={chatMessagesRef} />
      <ChatInput
        setMessages={setMessages}
        messageContainerRef={chatMessagesRef}
      />
    </div>
  );
};

export default ChatArea;
