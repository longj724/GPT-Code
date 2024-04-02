import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex size-full flex-col items-center justify-center">
      <Loader className="mt-4 size-12 animate-spin" />
    </div>
  );
}
