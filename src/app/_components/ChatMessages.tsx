"use client";
// External Dependencies
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Messages } from "@prisma/client";

// Relative Dependencies
import ChatMessage from "./ChatMessage";

type Props = {};

const ChatMessages = (props: Props) => {
  const { chatID } = useParams();

  const { data: messages } = useQuery({
    queryKey: ["chat", chatID],
    enabled: !!chatID,
    queryFn: async () => {
      const response = await fetch(`/api/get-messages?chat_id=${chatID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()).messages as Messages[];
    },
  });

  return messages ? (
    <div className="w-full overflow-y-auto pb-1">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  ) : (
    <div>No messages</div>
  );
};

export default ChatMessages;
