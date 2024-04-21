"use client";
// External Dependencies
import { useCallback, useRef, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { forwardRef, useEffect } from "react";
import { Messages } from "@prisma/client";

// Relative Dependencies
import ChatMessage from "./ChatMessage";
import NoMessages from "./NoMessages";
import ChatScrollButtons from "./ChatScrollButtons";

type Props = {
  messages: Messages[] | null;
  setChangedModel: Dispatch<SetStateAction<boolean>>;
};

const ChatMessages = forwardRef<HTMLDivElement, Props>(
  ({ messages, setChangedModel }, ref) => {
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isAtTop, setIsAtTop] = useState(false);
    const isAutoScrolling = useRef(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
      if ((ref as React.MutableRefObject<HTMLDivElement>).current !== null) {
        (ref as React.MutableRefObject<HTMLDivElement>).current.scrollTop = (
          ref as React.MutableRefObject<HTMLDivElement>
        ).current.scrollHeight;
      }
    }, [messages]);

    const handleScroll = useCallback((e: any) => {
      const bottom =
        Math.round(e.target.scrollHeight) - Math.round(e.target.scrollTop) ===
        Math.round(e.target.clientHeight);
      setIsAtBottom(bottom);

      const top = e.target.scrollTop === 0;
      setIsAtTop(top);

      const isOverflow = e.target.scrollHeight - 32 > e.target.clientHeight;
      setIsOverflowing(isOverflow);
    }, []);

    const scrollToTop = useCallback(() => {
      if ((ref as React.MutableRefObject<HTMLDivElement>).current !== null) {
        (ref as React.MutableRefObject<HTMLDivElement>).current.scrollTop = 0;
      }
    }, []);

    const scrollToBottom = useCallback(() => {
      isAutoScrolling.current = true;

      setTimeout(() => {
        if ((ref as React.MutableRefObject<HTMLDivElement>).current !== null) {
          (ref as React.MutableRefObject<HTMLDivElement>).current.scrollTop = (
            ref as React.MutableRefObject<HTMLDivElement>
          ).current.scrollHeight;
        }

        isAutoScrolling.current = false;
      }, 0);
    }, []);

    return (
      <>
        {messages && messages.length > 0 && (
          <div
            className="relative w-full overflow-y-auto pb-1"
            ref={ref}
            onScroll={handleScroll}
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <ChatScrollButtons
              isAtTop={isAtTop}
              isAtBottom={isAtBottom}
              isOverflowing={isOverflowing}
              scrollToTop={scrollToTop}
              scrollToBottom={scrollToBottom}
            />
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
