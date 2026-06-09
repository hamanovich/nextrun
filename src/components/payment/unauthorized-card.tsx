import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const UnauthorizedCard = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-destructive text-center">
          Unauthorized
        </CardTitle>
        <CardDescription className="text-center">
          This payment session does not belong to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </CardContent>
    </Card>
  </div>
);
