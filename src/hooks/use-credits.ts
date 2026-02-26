"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

const fetchCredits = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<number> => {
  const response = await fetch("/api/credits", {
    cache: "no-store",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  let creditsData;
  try {
    creditsData = await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse credits response: ${jsonError}`);
  }

  const creditsValue =
    typeof creditsData === "number"
      ? creditsData
      : typeof creditsData === "object" &&
          creditsData !== null &&
          typeof creditsData.credits === "number"
        ? creditsData.credits
        : 0;

  return creditsValue;
};

export const useCredits = () => {
  const { data: session } = authClient.useSession();

  return useQuery({
    queryKey: ["credits", session?.user?.id],
    queryFn: ({ signal }) => fetchCredits({ signal }),
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useCreditsRefetch = () => {
  const { data: session } = authClient.useSession();
  const { refetch } = useCredits();

  return {
    refetchCredits: refetch,
    isAuthenticated: !!session?.user?.id,
  };
};
