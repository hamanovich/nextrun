import type { ReactNode } from "react";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return <main className="product-compact px-5 py-8">{children}</main>;
}
