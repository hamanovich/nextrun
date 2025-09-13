import Link from "next/link";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ActionButtons = () => (
  <div className="flex flex-col gap-2">
    <Link href="/">
      <Button className="w-full">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
    </Link>
    <Link href="/profile">
      <Button variant="outline" className="w-full">
        <CreditCard className="w-4 h-4 mr-2" />
        View Account
      </Button>
    </Link>
  </div>
);
