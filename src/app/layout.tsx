import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";
import { CreditsProvider } from "@/contexts/credits-context";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider/auth-provider";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextRun",
  description: "NextRun - Next.js template",
  applicationName: "NextRun",
  authors: [
    {
      url: "https://www.linkedin.com/in/hamanovich/",
      name: "Siarhei Hamanovich",
    },
  ],
  keywords: [
    "nextrun",
    "nextjs",
    "typescript",
    "tailwind",
    "shadcn",
    "ui",
    "react",
    "javascript",
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CreditsProvider>
              <Navbar />
              {children}
              <Footer />
            </CreditsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
