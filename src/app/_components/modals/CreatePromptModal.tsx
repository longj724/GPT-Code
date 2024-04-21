"use client";
// External Dependencies
import { useState, Dispatch, SetStateAction } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Prompts } from "@prisma/client";
import { useRouter } from "next/navigation";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userID: string;
};

const CreatePromptModal = ({ open, setOpen, userID }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");

  const { mutate: createPrompt } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/create-prompt", {
        method: "POST",
        body: JSON.stringify({ content: prompt, userID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Prompts;
    },
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["prompts", userID] });
      router.refresh();
    },
    onError: (error) => {
      // TODO: Handle error
      console.log(error);
    },
  });

  const handleSavePrompt = async () => {
    if (prompt !== "") {
      createPrompt();
    }
    // TODO: Toast with info about no chat name entered
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-1/2 sm:w-3/5">
        <DialogHeader>
          <DialogTitle className="mb-4">Create Prompt</DialogTitle>
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

export default CreatePromptModal;
