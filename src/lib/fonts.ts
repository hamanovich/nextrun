import { Geist_Mono, IBM_Plex_Sans, Literata } from "next/font/google";

export const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext", "cyrillic"],
  preload: false,
});
