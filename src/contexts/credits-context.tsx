"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";

interface CreditsContextType {
  credits: number;
  isLoading: boolean;
  refetchCredits: () => Promise<void>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

interface CreditsProviderProps {
  children: ReactNode;
}

export function CreditsProvider({ children }: CreditsProviderProps) {
  const { data: session } = useSession();
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCredits = async () => {
    if (!session?.user?.id) {
      setCredits(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/credits", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

      setCredits(creditsValue);
    } catch (error) {
      console.error("Failed to fetch user credits:", error);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchCredits = async () => {
    await fetchCredits();
  };

  useEffect(() => {
    fetchCredits();
  }, [session?.user?.id]);

  return (
    <CreditsContext.Provider value={{ credits, isLoading, refetchCredits }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
