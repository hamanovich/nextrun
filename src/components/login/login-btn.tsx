"use client";

import { useState } from "react";
import type { VariantProps } from "class-variance-authority";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoginModal } from "./login-modal";
import { SignOutButton } from "./sign-out-button";

interface LoginBtnProps {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export const LoginBtn = ({ className, variant }: LoginBtnProps) => {
  const { data: session, status } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (status === "loading") return <>Loading…</>;

  if (session)
    return (
      <>
        Signed in as {session.user?.email ?? "Unknown user"} <br />
        <SignOutButton />
      </>
    );

  return (
    <>
      <Button
        className={className}
        variant={variant}
        aria-label="Open sign-in modal"
        aria-haspopup="dialog"
        aria-expanded={isModalOpen}
        onClick={() => setIsModalOpen(true)}
      >
        Sign in
      </Button>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
