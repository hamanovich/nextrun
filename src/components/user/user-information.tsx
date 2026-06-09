import Image from "next/image";
import { Calendar, Mail, Shield, User } from "lucide-react";
import { formatUserData, getProviderFromEmail } from "@/lib/user.utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface UserInformationProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const UserInformation = ({ user }: UserInformationProps) => (
  <Card className="overflow-hidden">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        <User className="h-5 w-5" />
        User Information
      </CardTitle>
      <CardDescription>
        Your account details and authentication status
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          {user.image ? (
            <Image
              alt={user.name ?? "User avatar"}
              src={user.image}
              width={72}
              height={72}
              className="border-border rounded-full border-2 shadow-sm"
            />
          ) : (
            <div className="border-border bg-muted flex size-[72px] items-center justify-center rounded-full border-2">
              <User className="text-muted-foreground size-8" />
            </div>
          )}
          <div className="border-background bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full border-2">
            <Shield className="size-3" />
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-foreground text-lg font-semibold">
              {user.name || "Anonymous User"}
            </h3>
            <p className="text-muted-foreground flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {user.email || "No email provided"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="default" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Authenticated
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {getProviderFromEmail(user.email)}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-foreground text-sm font-medium">Account Details</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              User ID
            </label>
            <div className="bg-muted/50 rounded-lg border p-3">
              <code className="text-foreground font-mono text-sm">
                {formatUserData(user.id)}
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Account Status
            </label>
            <div className="bg-muted/50 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <div className="bg-foreground size-2 rounded-full"></div>
                <span className="text-foreground text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
