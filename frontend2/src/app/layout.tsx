import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/constants";
import AuthContextProvider from "@/providers/authcontext";

const fontSans = FontSans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.name,
  description: site.description,
  icons: {
    icon: "./favicon.ico",
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
      <AuthContextProvider>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased flex flex-col",
            fontSans.className
          )}>
          {children}
        </body>
      </AuthContextProvider>
    </html>
  );
}
