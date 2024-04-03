"use client";
// External Dependencies
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Chats, Projects } from "@prisma/client";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  name: z.string(),
  programmingLanguages: z.string(),
  packages: z.string(),
  context: z.string(),
});

type CreateNewProjectResponse = {
  project: Projects;
  chat: Chats;
};

const CreateProjectModal = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate: createProject } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/create-project", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as CreateNewProjectResponse;
    },
    onSuccess: (data) => {
      const { project, chat } = data;
      setOpen(false);
      router.push(`/chat/${project.id}/${chat.id}`);
    },
    onError: (error) => {
      // TODO: Handle error
      console.log(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      programmingLanguages: "",
      packages: "",
      context: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    createProject(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center sm:gap-4 lg:gap-0">
                  <FormLabel className="w-1/5">Name</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programmingLanguages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center sm:gap-4 lg:gap-0">
                  <FormLabel className="w-1/5">Programming Languages</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="C#, Python, JavaScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packages"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center sm:gap-4 lg:gap-0">
                  <FormLabel className="w-1/5">Packages / Libraries</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Zod, NumPy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center sm:gap-4 lg:gap-0">
                  <FormLabel className="w-1/5">Context / Rules</FormLabel>
                  <FormControl className="w-full">
                    <Textarea
                      {...field}
                      placeholder="EX: This is a TODO list app, Style every component you write using tailwind"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-auto">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
