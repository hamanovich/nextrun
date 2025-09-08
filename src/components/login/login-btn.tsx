"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "./login-modal";
import { SignOutButton } from "./sign-out-button";

export function LoginBtn() {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === "loading") {
    return <>Loading…</>;
  }

  if (session) {
    return (
      <>
        Signed in as {session.user?.email ?? "Unknown user"} <br />
        <SignOutButton />
      </>
    );
  }
  return (
    <>
      <Button
        aria-label="Open sign-in modal"
        onClick={() => setIsModalOpen(true)}
      >
        Sign in
      </Button>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
