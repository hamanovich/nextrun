import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PricingContent } from "@/components/pricing/pricing-content";

export { metadata } from "./metadata";
export const revalidate = 3600;

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
