"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDownIcon,
  CreditCardIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";
import { useSignOut } from "@/hooks/use-sign-out";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/brand/button";

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
  const handleLogout = useSignOut();

  const userName = session?.user?.name || session?.user?.email || "User";
  const userEmail = session?.user?.email || "";
  const userAvatar = session?.user?.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="brand-user-menu">
          {userAvatar ? (
            <Image
              alt={userName}
              src={userAvatar}
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="bg-accent flex size-8 items-center justify-center rounded-full text-xs font-medium"
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <ChevronDownIcon className="size-3" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-5 font-medium wrap-anywhere">
              {userName}
            </p>
            <div className="flex flex-col items-start gap-2">
              <p className="text-muted-foreground text-xs leading-4 wrap-anywhere">
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
