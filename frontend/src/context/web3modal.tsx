"use client";

import { site } from "@/constants";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { ReactNode } from "react";

export const SEPOLIA_CHAIN_ID: number = 11155111;
export const OPTIMISM_CHATAIN_ID: number = 10;
export const LOCALHOST_CHATAIN_ID: number = 31337;
const projectId = "35fadd8ea93791ac21f87e7fa5c5d0ec";

const ethereumSepolia = {
  chainId: SEPOLIA_CHAIN_ID,
  name: "Ethereum Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io/",
  rpcUrl: `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
};

const localhost = {
  chainId: LOCALHOST_CHATAIN_ID,
  name: "Localhost Testnet",
  currency: "ETH",
  explorerUrl: "http://localhost:8545",
  rpcUrl: `http://localhost:8545`,
};

// const optimismSepolia = {
//   chainId: OPTIMISM_CHATAIN_ID,
//   name: "Optimism Sepolia",
//   currency: "ETH",
//   explorerUrl: "https://optimistic.etherscan.io/",
//   rpcUrl: `https://optimism-sepolia.infura.io/v3/${process.env.ALCHEMY_API_KEY}`,
// };

// const optimismMainnet = {
//   chainId: OPTIMISM_CHATAIN_ID,
//   name: "Optimism Mainnet",
//   currency: "ETH",
//   explorerUrl: "https://optimistic.etherscan.io/",
//   rpcUrl: `https://optimism-mainnet.infura.io/v3/${process.env.ALCHEMY_API_KEY}`,
// };

const metadata = {
  name: site.name,
  description: site.description,
  url: site.url,
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: 10,
  enableEmail: true,
});

createWeb3Modal({
  ethersConfig,
  chains: [ethereumSepolia, localhost],
  projectId: projectId,
  enableOnramp: true,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return children;
}
