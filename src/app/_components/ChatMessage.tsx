"use client";
// External Dependencies
import { Copy } from "lucide-react";
import { Messages } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

// Relative Dependencies
import { cn } from "~/lib/utils";
import { WithTooltip } from "~/components/ui/with-tooltip";

type Props = {
  message: Messages;
};

const ChatMessage = ({ message }: Props) => {
  // Message will be passed down through props
  const { type, content } = message;
  const searchParams = useSearchParams();
  const model = searchParams.get("model");

  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-center py-2",
        type === "user" ? "bg-muted/40" : "bg-muted",
      )}
    >
      <div className="flex w-4/5 flex-col ">
        <div className="flex flex-row items-center gap-2 p-2">
          <Image
            src="https://picsum.photos/35"
            width={35}
            height={35}
            alt="Model Image"
          />
          <h2 className="font-semibold">{type === "user" ? "You" : model}</h2>
          <div className="ml-auto flex flex-row">
            <WithTooltip
              delayDuration={200}
              display={<p>Copy</p>}
              side="top"
              trigger={<Copy size={18} />}
            />
          </div>
        </div>
        <p className="ml-auto w-[98%] leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
