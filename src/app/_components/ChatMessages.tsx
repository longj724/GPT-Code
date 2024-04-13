"use client";
// External Dependencies
import React from "react";
import { Messages } from "@prisma/client";

// Relative Dependencies
import ChatMessage from "./ChatMessage";

type Props = {
  messages: Messages[];
};

const ChatMessages = ({ messages }: Props) => {
  return messages.length > 0 ? (
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
