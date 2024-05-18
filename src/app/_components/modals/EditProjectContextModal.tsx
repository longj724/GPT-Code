"use client";
// External Dependencies
import { type Dispatch, type SetStateAction } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type Chats, type Projects } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Relative Dependencies
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

type Props = {
  projectID: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

const EditProjectContextModal = ({ isOpen, projectID, setIsOpen }: Props) => {
  const { user } = useUser();
  const router = useRouter();

  useQuery({
    queryKey: ["project", projectID, user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(
        `/api/get-project?user_id=${user?.id}&project_id=${projectID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const project = (await response.json()).project as Projects;

      form.reset({
        name: project.name,
        programmingLanguages: project.programming_languages ?? "",
        packages: project.packages ?? "",
        context: project.context ?? "",
      });

      return project;
    },
  });

  const { mutate: editProject } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/edit-project", {
        method: "POST",
        body: JSON.stringify({ ...data, projectID }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()).project as Projects;
    },
    onSuccess: () => {
      router.refresh();
      setIsOpen(false);
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
    editProject(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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

export default EditProjectContextModal;
