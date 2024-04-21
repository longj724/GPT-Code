// External Dependencies
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import React from "react";

type Props = {
  isAtTop: boolean;
  isAtBottom: boolean;
  isOverflowing: boolean;
  scrollToTop: () => void;
  scrollToBottom: () => void;
};

const ChatScrollButtons = ({
  isAtTop,
  isAtBottom,
  isOverflowing,
  scrollToTop,
  scrollToBottom,
}: Props) => {
  return (
    <div className="sticky bottom-[32px] ml-2 flex gap-1 sm:flex-col xl:flex-row">
      {!isAtTop && isOverflowing && (
        <CircleArrowUp
          className="cursor-pointer opacity-50 hover:opacity-100"
          size={32}
          onClick={scrollToTop}
        />
      )}

      {!isAtBottom && isOverflowing && (
        <CircleArrowDown
          className="cursor-pointer opacity-50 hover:opacity-100"
          size={32}
          onClick={scrollToBottom}
        />
      )}
    </div>
  );
};

export default ChatScrollButtons;
