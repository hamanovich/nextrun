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
        <CardTitle className="text-center text-destructive">
          Unauthorized
        </CardTitle>
        <CardDescription className="text-center">
          This payment session does not belong to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </CardContent>
    </Card>
  </div>
);
