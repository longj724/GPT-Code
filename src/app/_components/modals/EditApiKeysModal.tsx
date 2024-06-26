"use client";
// External Dependencies
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Key } from "lucide-react";
import { type GroqKeys, type OpenAIKeys, type Users } from "@prisma/client";
import { useUser } from "@clerk/nextjs";

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
import { useQueryClient } from "@tanstack/react-query";

type Props = {};

export type UserProfileResponse = {
  user: Users & {
    OpenAIKeys: OpenAIKeys;
    GroqKeys: GroqKeys;
  };
};

const EditApiKeysModal = (props: Props) => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [open, setIsOpen] = useState(false);
  const [openAIKey, setOpenAIKey] = useState("");
  const [groqKey, setGroqKey] = useState("");

  const { mutate: editApiKeys } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/api-keys", {
        method: "POST",
        body: JSON.stringify({ openAIKey, groqKey, userID: user?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as Users;
    },
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
    onError: (error) => {
      // TODO: Handle error
      console.log(error);
    },
  });

  useQuery({
    queryKey: ["users", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/user?user_id=${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await response.json()) as UserProfileResponse;
      setOpenAIKey(data.user.OpenAIKeys.key ?? "");
      setGroqKey(data.user.GroqKeys.key ?? "");

      return data;
    },
  });

  const handleSaveKeys = async () => {
    editApiKeys();
    // TODO: Toast with info about no chat name entered
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Key className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-1/2 sm:w-3/5">
        <DialogHeader>
          <DialogTitle className="mb-4">Edit API Keys</DialogTitle>
          <div className="flex flex-col gap-2">
            <div className="gap flex flex-row items-center">
              <Label htmlFor="name" className="w-1/5">
                OpenAI API Key
              </Label>
              <Input
                className="w-4/5"
                id="name"
                onChange={(e) => setOpenAIKey(e.target.value)}
                type="password"
                value={openAIKey}
              />
            </div>
            <div className="flex flex-row items-center">
              <Label htmlFor="name" className="w-1/5">
                Groq API Key
              </Label>
              <Input
                className="w-4/5"
                id="name"
                onChange={(e) => setGroqKey(e.target.value)}
                type="password"
                value={groqKey}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveKeys}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditApiKeysModal;
