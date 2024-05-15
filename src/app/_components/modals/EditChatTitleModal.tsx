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
  chatID: string;
};

const EditChatTitleModal = ({ chatID }: Props) => {
  const router = useRouter();
  const [open, setIsOpen] = useState(false);
  const [chatName, setChatName] = useState("");

  const { mutate: editChatName } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/edit-chat-info", {
        method: "POST",
        body: JSON.stringify({ name: chatName, chatID }),
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

  const handleSaveName = async () => {
    if (chatName !== "") {
      editChatName();
    }
    // TODO: Toast with info about no chat name entered
  };

  const handleChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FilePenLine
          className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
          size={20}
        />
      </DialogTrigger>
      <DialogContent className="w-1/2 sm:w-3/5">
        <DialogHeader>
          <DialogTitle className="mb-4">Edit Chat Title</DialogTitle>
          <div className="flex flex-row items-center">
            <Label htmlFor="name" className="w-1/5">
              Name
            </Label>
            <Input
              id="name"
              value={chatName}
              className="w-4/5"
              onChange={handleChatNameChange}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveName}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditChatTitleModal;
