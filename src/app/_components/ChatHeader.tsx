"use client";
// Exteral Dependencies
import { Menu, Package2, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Chats } from "@prisma/client";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Checkbox } from "~/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

type Props = {
  showSelectedModel: boolean;
};

const SettingMenu = () => {
  const { chatID } = useParams();
  const router = useRouter();

  const { mutate: editChatSettings } = useMutation({
    mutationFn: async (event: CheckedState) => {
      const response = await fetch("/api/edit-chat-info", {
        method: "POST",
        body: JSON.stringify({ excludePriorMessages: event, chatID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Chats;
    },
    onSuccess: (data) => {
      console.log(data);
      router.refresh();
    },
    onError: (error) => {
      // TODO: Handle error
      console.log(error);
    },
  });

  const { data: someChat } = useQuery({
    queryKey: ["chat", chatID],
    enabled: !!chatID,
    queryFn: async () => {
      const response = await fetch(`/api/get-chat?chat_id=${chatID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()).chat as Chats;
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Settings size={20} className="hover:cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className="flex flex-row gap-2 hover:cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <Checkbox
            onCheckedChange={(e) => editChatSettings(e)}
            checked={someChat?.exclude_prior_messages}
          />
          <span className="">Exclude prior chat history on new message</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ChatHeader = ({ showSelectedModel }: Props) => {
  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const chatName = searchParams.get("chat_name");

  return (
    <header className="lg:px flex h-14 min-h-[3.5rem] w-full items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="mr-2 shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex flex-row items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <h2>GPT Code</h2>
            </Link>
            <Link
              href="/"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package2 className="h-5 w-5" />
              Home
            </Link>
            {/* <Link
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              Orders
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link> */}
          </nav>
        </SheetContent>
      </Sheet>
      <div className=" flex w-full flex-1 justify-start">
        <div className="md:w-4/5 lg:w-3/5">
          {showSelectedModel && <h1>{model}</h1>}
        </div>
      </div>
      <div className="flex flex-1 justify-center">{chatName}</div>
      <div className="flex flex-1 justify-end">
        <SettingMenu />
      </div>
    </header>
  );
};

export default ChatHeader;
