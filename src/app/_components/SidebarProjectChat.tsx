// External Dependencies
import Link from "next/link";
import { useParams } from "next/navigation";

// Relative Dependencies
import { IChat } from "./Sidebar";
import { cn } from "~/lib/utils";

type Props = {
  chat: IChat;
};

function SidebarProjectChat({ chat }: Props) {
  const { chatID } = useParams();

  return (
    <div
      className={cn(
        chatID === chat.id ? "bg-muted hover:bg-muted/40" : "hover:bg-muted",
        "ml-8 flex flex-row rounded-sm",
      )}
    >
      <Link href={""} className={cn("w-full rounded-lg p-2 hover:bg-muted")}>
        <span>{chat.name}</span>
      </Link>
    </div>
  );
}

export default SidebarProjectChat;
