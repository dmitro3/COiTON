import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/constants";
import AuthContextProvider from "@/context/authContext";
import { Toaster } from "@/components/ui/sonner";

const fontSans = Inter({
  subsets: ["latin"],
  // variable: "--font-sans",
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-background"
      suppressContentEditableWarning
      suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontSans.className
        )}>
        <AuthContextProvider>
          <Toaster richColors />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
