"use client";
// Exteral Dependencies
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

type Props = {};

const ChatHeader = (props: Props) => {
  const { projectName } = useParams();

  return (
    <header className="flex h-14 items-center justify-stretch gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">Acme Inc</span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="">Put Model Selection Here</div>
      <div>Project Name</div>
      Account Button Here
    </header>
  );
};

export default ChatHeader;
