// External Dependencies
import { currentUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

// Relative Dependencies

const NoChatSelected = async () => {
  const user = await currentUser();

  return !user ? (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className=" text-3xl">Welcome to CodeGPT</h1>
      <SignIn redirectUrl="/" />
      {/* TODO: Will open up a modal that shows a demo video */}
      <Button>Watch Demo</Button>
    </div>
  ) : (
    <div>No Project Selected Page</div>
  );
};

export default NoChatSelected;
