import { Suspense } from "react";
import { PricingContent } from "@/components/pricing/pricing-content";

export { metadata } from "./metadata";
export const dynamic = "force-dynamic";

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <PricingContent isMocked />
    </Suspense>
  );
}
