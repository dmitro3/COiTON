"use client";

import { site } from "@/constants";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { ReactNode } from "react";

export const SEPOLIA_CHAIN_ID: number = 11155111;

const ethereumSepolia = {
  chainId: SEPOLIA_CHAIN_ID,
  name: "Ethereum Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  // websocket: wss://eth-sepolia.g.alchemy.com/v2/
};

const metadata = {
  name: site.name,
  description: site.description,
  url: site.url,
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 10,
});

createWeb3Modal({
  ethersConfig,
  chains: [ethereumSepolia],
  projectId: "35fadd8ea93791ac21f87e7fa5c5d0ec",
  enableOnramp: true,
  enableAnalytics: false,
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return children;
}
