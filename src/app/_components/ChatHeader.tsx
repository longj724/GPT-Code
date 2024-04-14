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

  return (
    <header className="lg:px flex h-14 min-h-[3.5rem] w-full items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
      <div className="flex w-full flex-1 justify-start">
        <div className="md:w-4/5 lg:w-3/5">
          {showSelectedModel && <h1>{model}</h1>}
        </div>
      </div>
      <div className="flex flex-1 justify-center">Project Name</div>
      <div className="flex flex-1 justify-end">Account Button Here</div>
    </header>
  );
};

export default ChatHeader;
