"use client";
// External Dependencies
import { Check, Copy } from "lucide-react";
import { type Messages } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

// Relative Dependencies
import MessageMarkdown from "./MessageMarkdown";
import { cn } from "~/lib/utils";
import { WithTooltip } from "~/components/ui/with-tooltip";
import { useCopyToClipboard } from "~/lib/hooks/useCopyToClipboard";

type Props = {
  message: Messages;
};

const ChatMessage = ({ message }: Props) => {
  const { user } = useUser();
  const { type, content } = message;
  const searchParams = useSearchParams();
  const model = searchParams.get("model");

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(content);
  };

  const getModelLogo = () => {
    if (model === "GPT-3.5-Turbo" || model === "GPT-4-Turbo") {
      return "/ChatGPTImage.png";
    } else if (model === "Mixtral 8x7b") {
      return "/MixtralLogo.png";
    } else {
      return "/LlamaLogo.jpeg";
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-center py-3",
        type === "user" ? "bg-muted/40" : "bg-muted",
      )}
    >
      <div className="flex w-4/5 flex-col ">
        <div className="flex flex-row items-center gap-2 p-2">
          <Image
            src={type === "user" ? user?.imageUrl ?? "" : getModelLogo()}
            width={30}
            height={30}
            alt="Model Logo"
            className="rounded-full"
          />
          <h2 className="font-semibold">{type === "user" ? "You" : model}</h2>
          <div className="ml-auto flex flex-row">
            <WithTooltip
              delayDuration={200}
              display={<p>Copy</p>}
              side="top"
              trigger={
                isCopied ? (
                  <Check size={18} className="text-gray-500" />
                ) : (
                  <Copy
                    size={18}
                    onClick={onCopy}
                    className="hover:text-gray-500"
                  />
                )
              }
            />
          </div>
        </div>
        <MessageMarkdown content={content} />
      </div>
    </div>
  );
};

export default ChatMessage;
