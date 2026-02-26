"use client";

import { useState } from "react";
import type { VariantProps } from "class-variance-authority";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoginModal } from "./login-modal";
import { SignOutButton } from "./sign-out-button";

interface LoginBtnProps {
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export const LoginBtn = ({ className, variant }: LoginBtnProps) => {
  const { data: session, isPending } = authClient.useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isPending) return <>Loading…</>;

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
