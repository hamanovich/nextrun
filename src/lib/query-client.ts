"use client";

import { QueryClient } from "@tanstack/react-query";

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 3,
        refetchOnWindowFocus: false,
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") return makeQueryClient();
  // A single browser client survives React suspending during the first render.
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
};
