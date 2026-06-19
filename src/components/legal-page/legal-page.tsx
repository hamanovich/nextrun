import { type ReactNode } from "react";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export const LegalPage = ({ title, lastUpdated, children }: LegalPageProps) => (
  <div className="container mx-auto max-w-4xl px-6 py-16">
    <div className="max-w-none">
      <h1 className="mb-8 text-4xl font-bold">{title}</h1>

      <div className="space-y-8">{children}</div>

      <div className="mt-12 border-t pt-8">
        <p className="text-muted-foreground text-sm">
          Last updated: {lastUpdated}
        </p>
      </div>
    </div>
  </div>
);
