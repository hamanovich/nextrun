import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const AuthRequiredCard = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-destructive text-center">
          Authentication Required
        </CardTitle>
        <CardDescription className="text-center">
          Please sign in to view your payment details.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/auth/signin">
          <Button>Sign In</Button>
        </Link>
      </CardContent>
    </Card>
  </div>
);
