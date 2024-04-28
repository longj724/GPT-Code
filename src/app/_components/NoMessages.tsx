// External Dependencies
import { Dispatch, SetStateAction } from "react";
import { useQueryParam, StringParam, withDefault } from "use-query-params";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

// Relative Dependencies
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { UserProfileResponse } from "./modals/EditApiKeysModal";

type Props = {
  setChangedModel: Dispatch<SetStateAction<boolean>>;
};

const NoMessages = ({ setChangedModel }: Props) => {
  const { user } = useUser();
  const [_, setModel] = useQueryParam(
    "model",
    withDefault(StringParam, "GPT-3.5-Turbo"),
  );

  const { data: userProfile } = useQuery({
    queryKey: ["users", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const response = await fetch(`/api/user?user_id=${user?.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return (await response.json()) as UserProfileResponse;
    },
  });

  const handleValueChange = (value: string) => {
    setChangedModel(true);
    setModel(value);
  };

  return (
    <div className="flex h-full w-1/2  flex-col items-center justify-center">
      <h1 className="mb-4">Select a Model</h1>
      <Select onValueChange={handleValueChange}>
        <SelectTrigger id="status" aria-label="Select Model">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="GPT-3.5-Turbo"
            disabled={!userProfile?.user.OpenAIKeys?.key}
            className="hover:cursor-pointer"
          >
            GPT-3.5-Turbo{" "}
            {!userProfile?.user.OpenAIKeys?.key && "No OpenAI API Key Added"}
          </SelectItem>
          <SelectItem
            disabled={!userProfile?.user.OpenAIKeys?.key}
            value="GPT-4-Turbo"
            className="hover:cursor-pointer"
          >
            GPT-4-Turbo{" "}
            {!userProfile?.user.OpenAIKeys.key && "No OpenAI API Key Added"}
          </SelectItem>
          <SelectItem
            disabled={!userProfile?.user.GroqKeys?.key}
            value="Mixtral 8x7b"
            className="hover:cursor-pointer"
          >
            Mixtral 8x7b{" "}
            {!userProfile?.user.GroqKeys?.key && "No Groq API Key Added"}
          </SelectItem>
          <SelectItem
            disabled={!userProfile?.user.GroqKeys?.key}
            value="LLaMA3 8b"
            className="hover:cursor-pointer"
          >
            LLaMA3 70b{" "}
            {!userProfile?.user.GroqKeys?.key && "No Groq API Key Added"}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NoMessages;
