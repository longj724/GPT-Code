"use client";
// External Dependencies
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Chats } from "@prisma/client";
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
  existingPrompt: string;
  isOpen: boolean;
  promptID: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userID: string;
};

const EditPromptModal = ({
  existingPrompt,
  isOpen,
  promptID,
  setIsOpen,
  userID,
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    setPrompt(existingPrompt);
  }, [existingPrompt]);

  const { mutate: editPrompt } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/edit-prompt", {
        method: "POST",
        body: JSON.stringify({ content: prompt, promptID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Chats;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts", userID] });
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
