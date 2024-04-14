"use client";
// External Dependencies
import { Dispatch, SetStateAction } from "react";
import { forwardRef, useEffect } from "react";
import { Messages } from "@prisma/client";

// Relative Dependencies
import ChatMessage from "./ChatMessage";
import NoMessages from "./NoMessages";

type Props = {
  messages: Messages[] | null;
  setChangedModel: Dispatch<SetStateAction<boolean>>;
};

const ChatMessages = forwardRef<HTMLDivElement, Props>(
  ({ messages, setChangedModel }, ref) => {
    useEffect(() => {
      if ((ref as React.MutableRefObject<HTMLDivElement>).current !== null) {
        (ref as React.MutableRefObject<HTMLDivElement>).current.scrollTop = (
          ref as React.MutableRefObject<HTMLDivElement>
        ).current.scrollHeight;
      }
    }, [messages]);

    return (
      <>
        {messages && messages.length > 0 && (
          <div className="w-full overflow-y-auto pb-1" ref={ref}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        {messages && messages.length === 0 && (
          <NoMessages setChangedModel={setChangedModel} />
        )}
      </>
    );
  },
);

export default ChatMessages;
