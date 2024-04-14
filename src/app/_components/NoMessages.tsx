// External Dependencies
import { Dispatch, SetStateAction } from "react";
import { useQueryParam, StringParam, withDefault } from "use-query-params";

// Relative Dependencies
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type Props = {
  setChangedModel: Dispatch<SetStateAction<boolean>>;
};

const NoMessages = ({ setChangedModel }: Props) => {
  const [_, setModel] = useQueryParam(
    "model",
    withDefault(StringParam, "GPT-3.5-Turbo"),
  );

  const handleValueChange = (value: string) => {
    setChangedModel(true);
    setModel(value);
  };

  return (
    <div className="flex h-full w-1/2  flex-col items-center justify-center">
      <h1 className="mb-4">Select a Model</h1>
      <Select defaultValue="GPT-3.5-Turbo" onValueChange={handleValueChange}>
        <SelectTrigger id="status" aria-label="Select Model">
          <SelectValue placeholder="Select Model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GPT-3.5-Turbo">GPT-3.5-Turbo</SelectItem>
          <SelectItem value="GPT-4-Turbo">GPT-4-Turbo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NoMessages;
