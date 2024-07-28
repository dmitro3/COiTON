"use client";

import React, { ReactNode } from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import { config, projectId } from "@/config";
import AuthProvider from "./authprovider";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  wagmiConfig: config as any,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeVariables: {
    "--w3m-font-family": '"Space Grotesk", sans-serif',
    "--w3m-accent": "#019d90",
    "--w3m-color-mix": "#050505",
  },
});

export default function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
