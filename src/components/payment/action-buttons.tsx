import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ActionButtons = () => (
  <div className="flex flex-col gap-2">
    <Link href="/">
      <Button className="w-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>
    </Link>
    <Link href="/profile">
      <Button variant="outline" className="w-full">
        <CreditCard className="mr-2 h-4 w-4" />
        View Account
      </Button>
    </Link>
  </div>
);
