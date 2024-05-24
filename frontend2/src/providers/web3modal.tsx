"use client";

import { site } from "@/constants";
import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalTheme,
} from "@web3modal/ethers/react";
import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const SEPOLIA_CHAIN_ID: number = 11155111;
export const OPTIMISM_CHAIN_ID: number = 11155420;
export const LISK_CHAIN_ID: number = 4202;
export const ANVIL_CHAIN_ID: number = 31337;

const ethereumSepolia = {
  chainId: SEPOLIA_CHAIN_ID,
  name: "Ethereum Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  // websocket: wss://eth-sepolia.g.alchemy.com/v2/
};

const optimismSepolia = {
  chainId: OPTIMISM_CHAIN_ID,
  name: "OP Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia-optimism.etherscan.io/",
  rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  // websocket: wss://opt-sepolia.g.alchemy.com/v2/
};

const localhost = {
  chainId: ANVIL_CHAIN_ID,
  name: "Anvil Localhost",
  currency: "ETH",
  explorerUrl: "http://127.0.0.1:8545",
  rpcUrl: "http://127.0.0.1:8545",
  // websocket: wss://opt-sepolia.g.alchemy.com/v2/
};

const liskSepolia = {
  chainId: LISK_CHAIN_ID,
  name: "Lisk Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia-blockscout.lisk.com",
  rpcUrl: "https://rpc.sepolia-api.lisk.com",
  // websocket: wss://opt-sepolia.g.alchemy.com/v2/
};

const metadata = {
  name: site.name,
  description: site.description,
  url: site.url,
  icons: [
    "https://coiton.vercel.app/_next/image?url=%2Fimg%2Flogo.png&w=96&q=100",
  ],
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 10,
});

createWeb3Modal({
  ethersConfig,
  chains: [
    ethereumSepolia,
    // optimismSepolia,
    // localhost,
    // liskSepolia,
  ],
  projectId: "0a4f797ca31c020f3cb7579960b64b36",
  enableOnramp: true,
  enableAnalytics: true,
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  const { setThemeMode, setThemeVariables } = useWeb3ModalTheme();

  setThemeMode("dark");

  setThemeVariables({
    "--w3m-accent": "#019D91",
    "--w3m-font-size-master": "0.8",
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// import React, { ReactNode } from "react";

// import { createWeb3Modal } from "@web3modal/wagmi/react";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { State, WagmiProvider } from "wagmi";
// import AuthContextProvider from "./authcontext";
// import { Toaster } from "@/components/ui/sonner";
// import { config, projectId } from "@/config";
// import ContractContextProvider from "./contract";

// const queryClient = new QueryClient();

// if (!projectId) throw new Error("Project ID is not defined");

// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true,
//   enableOnramp: true,
// themeMode: "dark",
// themeVariables: {
// "--w3m-accent": "#019D91",
// "--w3m-font-size-master": "0.8",
// },
// });

// export default function Web3ModalProvider({
//   children,
//   initialState,
// }: {
//   children: ReactNode;
//   initialState?: State;
// }) {
//   return (
//     <WagmiProvider config={config} initialState={initialState}>
//       <QueryClientProvider client={queryClient}>
//         <ContractContextProvider>
//           <AuthContextProvider>
//             <Toaster richColors theme="dark" />
//             {children}
//           </AuthContextProvider>
//         </ContractContextProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }
