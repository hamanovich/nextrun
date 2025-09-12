import { AlertCircle } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-6 mb-4">
          <AlertCircle className="size-16 text-orange-600 dark:text-orange-400" />
        </div>
      </div>
      <div className="mb-8 max-w-md">
        <h1 className="text-3xl font-semibold mb-4">Loading...</h1>
        <p className="text-muted-foreground text-lg">{message}</p>
      </div>
    </div>
  </div>
);
