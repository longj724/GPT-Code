"use client";
// External Dependencies
import { UserButton } from "@clerk/nextjs";

// Relative Dependencies
import { Button } from "~/components/ui/button";

type Props = {};

const Profile = (props: Props) => {
  return (
    <Button variant="outline" size="icon">
      <UserButton afterSignOutUrl="/" />
      <span className="sr-only">Logout</span>
    </Button>
  );
};

export default Profile;
