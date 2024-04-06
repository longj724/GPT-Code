// External Dependencies
import React from "react";

// Relative Dependencies
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatHeader from "./ChatHeader";

type Props = {};

const ChatArea = (props: Props) => {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
