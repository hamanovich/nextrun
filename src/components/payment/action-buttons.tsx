import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/brand/button";

export const ActionButtons = () => (
  <div className="flex flex-col gap-2">
    <Button asChild className="w-full">
      <Link href="/">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </Button>
    <Button asChild variant="outline" className="w-full">
      <Link href="/profile">
        <CreditCard className="mr-2 h-4 w-4" />
        View Account
      </Link>
    </Button>
  </div>
);
