import type { Metadata } from "next";
import { Archivo as FontSans } from "next/font/google";

import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { site } from "@/constants";
import Header from "@/components/shared/header";
import LoadingScreen from "@/components/shared/loading-screen";
import Footer from "@/components/shared/footer";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: site.title,
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased flex flex-col",
            fontSans.variable
          )}>
          <ClerkLoading>
            <LoadingScreen />
          </ClerkLoading>
          <ClerkLoaded>
            <main className="flex-1">{children}</main>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
