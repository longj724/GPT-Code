// External Dependencies
import Link from "next/link";
import { useParams } from "next/navigation";
import { Chats } from "@prisma/client";

// Relative Dependencies
import { cn, modelToNameMap } from "~/lib/utils";
import EditChatTitleModal from "./modals/EditChatTitleModal";
import DeleteChatModal from "./modals/DeleteChatModal";

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
        href={`/chat/${projectID}/${chat.id}?model=${modelToNameMap[chat.model_id]}`}
        className={cn("flex w-full items-center rounded-lg p-2 hover:bg-muted")}
      >
        <span>{chat.name}</span>
        <div className="ml-auto flex flex-row items-center justify-center gap-1">
          <EditChatTitleModal chatID={chat.id} />
          <DeleteChatModal name={chat.name} chatID={chat.id} />
        </div>
      </Link>
    </div>
  );
}

export default SidebarProjectChat;
