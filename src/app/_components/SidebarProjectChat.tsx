// External Dependencies
import { FilePenLine } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Relative Dependencies
import { cn } from "~/lib/utils";
import { Chats } from "@prisma/client";

type Props = {
  projectID: string;
  chat: Chats;
};

function SidebarProjectChat({ chat, projectID }: Props) {
  const { chatID } = useParams();

  return (
    <div
      className={cn(
        chatID === chat.id ? "bg-muted hover:bg-muted/40" : "hover:bg-muted",
        "ml-8 flex flex-row rounded-sm",
      )}
    >
      <Link
        href={`/chat/${projectID}/${chat.id}`}
        className={cn("flex w-full items-center rounded-lg p-2 hover:bg-muted")}
      >
        <span>{chat.name}</span>
        <div
          className="ml-auto flex h-5 w-5 items-center justify-center"
          // onClick={handleOptionsClick}/
        >
          <FilePenLine className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500" />
        </div>
      </Link>
    </div>
  );
}

export default SidebarProjectChat;
