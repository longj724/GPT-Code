// External Dependencies
import Link from "next/link";
import { useParams } from "next/navigation";
import { type Chats } from "@prisma/client";

// Relative Dependencies
import { cn, modelNameToDisplayNameMap } from "~/lib/utils";
import EditChatTitleModal from "./modals/EditChatTitleModal";
import DeleteChatModal from "./modals/DeleteChatModal";
import { WithTooltip } from "~/components/ui/with-tooltip";

type Props = {
  chat: Chats;
  projectID: string;
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
        href={`/chat/${projectID}/${chat.id}?chat_name=${chat.name}&model=${modelNameToDisplayNameMap[chat.model_name]}`}
        className={cn("flex w-full items-center rounded-lg p-2 hover:bg-muted")}
      >
        <span>{chat.name}</span>
        <div className="ml-auto flex flex-row items-center justify-center gap-1">
          <WithTooltip
            delayDuration={200}
            display={<p>Edit Title</p>}
            side="top"
            trigger={<EditChatTitleModal chatID={chat.id} />}
          />
          <WithTooltip
            delayDuration={200}
            display={<p>Delete</p>}
            side="top"
            trigger={
              <div>
                <DeleteChatModal name={chat.name} chatID={chat.id} />
              </div>
            }
          />
        </div>
      </Link>
    </div>
  );
}

export default SidebarProjectChat;
