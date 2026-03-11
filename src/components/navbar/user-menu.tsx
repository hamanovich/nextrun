"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDownIcon,
  CreditCardIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  } | null;
  credits: number;
}

export const UserMenu = ({ session, credits }: UserMenuProps) => {
  const handleLogout = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (err) {
      logger.error("Sign out failed", err);
    }
  };

  const userName = session?.user?.name || session?.user?.email || "User";
  const userEmail = session?.user?.email || "";
  const userAvatar = session?.user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 px-2 py-0 hover:bg-accent hover:text-accent-foreground"
        >
          {userAvatar ? (
            <Image
              alt={userName}
              src={userAvatar}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="mr-1 flex size-8 items-center justify-center rounded-full bg-accent text-xs font-medium"
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <ChevronDownIcon className="h-3 w-3 ml-1" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <div className="flex flex-col items-start gap-2">
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
              <Badge className="text-xs">
                {credits.toLocaleString()}{" "}
                {credits === 1 ? "credit" : "credits"}
              </Badge>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/pricing" className="flex items-center">
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Pricing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive">
          <LogOutIcon className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
