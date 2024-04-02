// External Dependencies
import { Copy } from "lucide-react";
import Image from "next/image";

// Relative Dependencies
type Props = {};

const ChatMessage = (props: Props) => {
  // Message will be passed down through props
  const message = "";
  const type = "system";
  const model = "GPT-4 Turbor";

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {/* Image goes here */}
        <h2>{model}</h2>
        <Copy size={18} />
      </div>
      {message}
    </div>
  );
};

export default ChatMessage;
