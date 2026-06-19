import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PaymentStatusCardProps {
  title: string;
  description: string;
  tone?: "default" | "error";
  action?: ReactNode;
}

const BackToHome = (
  <Button variant="outline" asChild>
    <Link href="/">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Home
    </Link>
  </Button>
);

export const PaymentStatusCard = ({
  title,
  description,
  tone = "error",
  action = BackToHome,
}: PaymentStatusCardProps) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle
          className={cn("text-center", tone === "error" && "text-destructive")}
        >
          {title}
        </CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">{action}</CardContent>
    </Card>
  </div>
);
