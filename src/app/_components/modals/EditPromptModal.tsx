"use client";
// External Dependencies
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Chats } from "@prisma/client";
import { FilePenLine } from "lucide-react";
import { useRouter } from "next/navigation";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

type Props = {
  existingPrompt: string;
};

const EditPromptModal = ({ existingPrompt }: Props) => {
  const router = useRouter();
  const [open, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState(existingPrompt);

  const { mutate: editPrompt } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/edit-prompt", {
        method: "POST",
        body: JSON.stringify({ prompt }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Chats;
    },
    onSuccess: () => {
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      // TODO: Handle error
      console.log(error);
    },
  });

  const handleSavePrompt = async () => {
    if (prompt !== "") {
      editPrompt();
    }
    // TODO: Toast with info about no chat name entered
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className="flex flex-row items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <FilePenLine
            size={22}
            className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-1/2 sm:w-3/5">
        <DialogHeader>
          <DialogTitle className="mb-4">Edit Prompt</DialogTitle>
          <div className="flex flex-row items-center">
            <Label htmlFor="name" className="w-1/5">
              Prompt
            </Label>
            <Input
              id="name"
              value={prompt}
              className="w-4/5"
              onChange={handlePromptChange}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleSavePrompt}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPromptModal;