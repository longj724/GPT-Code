"use client";
// External Dependencies
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Relative Dependencies
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type Props = {
  chatID: string;
  name: string;
};

const DeleteChatModal = ({ chatID, name }: Props) => {
  const router = useRouter();
  const { mutate: deleteChat } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/delete-chat", {
        method: "POST",
        body: JSON.stringify({ chatID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await response.json();
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      // TODO: Handle error
      console.log(error);
    },
  });

  const handleDeleteChat = async (values: any) => {
    deleteChat();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex">
        <Trash2
          className="hover:pointer rounded-sm p-[3px] hover:bg-gray-500"
          size={20}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete <i>{name}</i>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this chat?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteChat}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChatModal;
