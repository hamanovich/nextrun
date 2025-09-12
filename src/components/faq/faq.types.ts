import type { ReactNode } from "react";

export interface FaqItem {
  question: string;
  answer: ReactNode;
}

export interface FaqProps {
  badge?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
  faqs?: ReadonlyArray<FaqItem>;
}
