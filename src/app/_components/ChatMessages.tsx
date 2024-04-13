"use client";
// External Dependencies
import { forwardRef, useEffect } from "react";
import { Messages } from "@prisma/client";

// Relative Dependencies
import ChatMessage from "./ChatMessage";

type Props = {
  messages: Messages[];
};

const ChatMessages = forwardRef<HTMLDivElement, Props>(({ messages }, ref) => {
  useEffect(() => {
    if (ref !== null) {
      (ref as React.MutableRefObject<HTMLDivElement>).current.scrollTop = (
        ref as React.MutableRefObject<HTMLDivElement>
      ).current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto pb-1" ref={ref}>
      {messages.length > 0 ? (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      ) : (
        <div>No messages</div>
      )}
    </div>
  );
});

export default ChatMessages;
