"use client";
// External Dependencies
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Projects } from "@prisma/client";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

type Props = {};

const CreateProjectModal = (props: Props) => {
  const router = useRouter();
  const { mutate: createProject } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/create-project", {
        method: "POST",
        body: JSON.stringify({ blank: "" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Projects;
    },
    // onSuccess: (data) => {
    //   router.push(`/chat/${data.project_id}/${data.id}`);
    // },
  });

  const formSchema = z.object({
    name: z.string(),
  });

  const handleCreateProjects = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto mr-4 h-8">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 sm:w-3/5">
        <DialogHeader>
          <DialogTitle className="mb-2">Create Project</DialogTitle>
          <DialogDescription>
            Add information about your project that AI will use for context on
            all messages
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-row items-center">
            <Label htmlFor="name" className="w-1/5">
              Name
            </Label>
            <Input id="name" value="" className="w-4/5" />
          </div>
          <div className="flex flex-row items-center">
            <Label htmlFor="name" className="w-1/5">
              Programming Languages
            </Label>
            <div className="relative w-4/5">
              <Input
                id="name"
                value=""
                className=""
                placeholder="JavaScript, Python, C#..."
              />
              {/* <Info className="text-muted-foreground absolute left-12.5 top-2.5 h-4 w-4" /> */}
            </div>
          </div>
          <div className="flex flex-row items-center">
            <Label htmlFor="name" className="w-1/5">
              Packages
            </Label>
            <Input
              id="name"
              value=""
              className="w-4/5"
              placeholder="Axois, Zod"
            />
          </div>
          <div className="flex flex-row ">
            <Label htmlFor="name" className="mt-2 w-1/5">
              Context / Rules
            </Label>
            <Textarea
              className="w-4/5"
              placeholder="EX: This is a TODO list app, Style every component you write using tailwind"
            />
            {/* <Input id="name" value="Pedro Duarte" className="w-4/5" /> */}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
