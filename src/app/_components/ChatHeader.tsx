"use client";
// Exteral Dependencies
import { useState } from "react";
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Props = {};

const ChatHeader = (props: Props) => {
  const { projectID, chatID } = useParams();
  const searchParams = useSearchParams();
  const model = searchParams.get("model");
  const [selectedModel, setSelectedModel] = useState<string>(
    model || "GPT-3.5-Turbo",
  );

  return (
    <header className="flex h-14 w-full items-center justify-between border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
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
      <div className="flex flex-1 justify-start">
        <div className="md:w-4/5 lg:w-2/5">
          <Select defaultValue="GPT-3.5-Turbo">
            <SelectTrigger id="status" aria-label="Select Model">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GPT-3.5-Turbo">GPT-3.5-Turbo</SelectItem>
              <SelectItem value="GPT-4-Turbo">GPT-4-Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-1 justify-center">Project Name</div>
      <div className="flex flex-1 justify-end">Account Button Here</div>
    </header>
  );
};

export default ChatHeader;
