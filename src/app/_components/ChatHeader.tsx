"use client";
// Exteral Dependencies
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

type Props = {
  showSelectedModel: boolean;
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
              href="#"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Package2 className="h-5 w-5" />
              Dashboard
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
      <div className="flex flex-1 justify-end"></div>
    </header>
  );
};

export default ChatHeader;
