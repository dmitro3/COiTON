import type { Metadata } from "next";
import { headers } from "next/headers";

import { cookieToInitialState } from "wagmi";
import { Analytics } from "@vercel/analytics/react";

import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { siteConfig, config } from "@/config";

import { fontSans } from "@/lib/fonts";
import Web3Provider from "@/providers/web3provider";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "./favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<ILayout>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-dvh font-sans antialiased flex flex-col flex-1",
          fontSans.variable
        )}>
        <div className="fixed inset-0 -z-10 size-full bg-transparent bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="fixed top-0 size-full -z-10 bg-transparent">
          <div className="fixed bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-initial/10 md:bg-initial/20 opacity-50 blur-[80px]"></div>
          <div className="fixed bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[80%] translate-y-[70%] rounded-full bg-initial/10 md:bg-initial/20 opacity-50 blur-[80px]"></div>
          <div className="fixed top-auto right-auto left-0 bottom-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-initial/10 md:bg-initial/20 opacity-50 blur-[80px]"></div>
        </div>
        <Analytics />
        <Web3Provider initialState={initialState}>{children}</Web3Provider>
      </body>
    </html>
  );
}
