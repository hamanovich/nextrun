import { Loader2 } from "lucide-react";

export interface AuthLoadingProps {
  message?: string;
}

export const AuthLoading = ({
  message = "Please wait while we check your authentication status.",
}: AuthLoadingProps) => (
  <div
    className="container mx-auto px-6 py-12"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-8">
        <Loader2 className="text-muted-foreground size-12 animate-spin" />
      </div>
      <div className="mb-8 max-w-md">
        <h1 className="mb-4 text-3xl font-semibold">Loading...</h1>
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  </div>
);
