"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useCredits } from "@/hooks/use-credits";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton } from "@/components/auth/sign-in-button";

type MobileAccountProps = { onNavigate: () => void };

export const MobileAccount = ({ onNavigate }: MobileAccountProps) => {
  const { data: session, isPending } = authClient.useSession();
  const { data: credits, isError } = useCredits();
  const pathname = usePathname();

  if (isPending) return <Skeleton className="h-16 w-full" />;
  if (!session) return <SignInButton className="w-full" />;

  const name = session.user.name || session.user.email || "User";
  return (
    <Link
      href="/profile"
      onClick={onNavigate}
      aria-label={`Profile: ${name}`}
      aria-current={pathname === "/profile" ? "page" : undefined}
      className="brand-mobile-profile"
    >
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt=""
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span
          className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">
          {session.user.email}
        </span>
        <span className="text-muted-foreground text-xs">
          {credits !== undefined
            ? `${credits.toLocaleString()} ${credits === 1 ? "credit" : "credits"}`
            : isError
              ? "Balance unavailable"
              : "Loading balance…"}
        </span>
      </span>
    </Link>
  );
};
