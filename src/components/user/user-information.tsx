import Image from "next/image";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type UserInformationProps = {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export const UserInformation = ({ user }: UserInformationProps) => (
  <Card>
    <CardHeader className="flex items-center gap-4">
      {user.image ? (
        <Image
          alt={user.name ?? "User avatar"}
          src={user.image}
          width={64}
          height={64}
          className="border-border size-16 shrink-0 rounded-full border object-cover"
        />
      ) : (
        <span className="bg-muted flex size-16 shrink-0 items-center justify-center rounded-full">
          <User className="text-muted-foreground size-6" aria-hidden />
        </span>
      )}
      <div className="flex min-w-0 flex-col gap-1">
        <CardTitle>
          <h2 className="wrap-anywhere">{user.name || "Anonymous User"}</h2>
        </CardTitle>
        <CardDescription className="wrap-anywhere">
          {user.email || "No email provided"}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <dl className="border-border border-t pt-4">
        <dt className="text-muted-foreground text-xs">User ID</dt>
        <dd className="mt-1 wrap-anywhere select-all">
          {user.id || "Not available"}
        </dd>
      </dl>
    </CardContent>
  </Card>
);
