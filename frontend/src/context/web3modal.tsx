"use client";

import { site } from "@/constants";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { ReactNode } from "react";

// export const SEPOLIA_CHAIN_ID: number = 11155111;
export const OPTIMISM_CHAIN_ID: number = 11155420;
// export const LISK_CHAIN_ID: number = 4202;
// export const ANVIL_CHAIN_ID: number = 31337;

// const ethereumSepolia = {
//   chainId: SEPOLIA_CHAIN_ID,
//   name: "Ethereum Sepolia Testnet",
//   currency: "ETH",
//   explorerUrl: "https://sepolia.etherscan.io/",
//   rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
//   // websocket: wss://eth-sepolia.g.alchemy.com/v2/
// };

const optimismSepolia = {
  chainId: OPTIMISM_CHAIN_ID,
  name: "OP Sepolia Testnet",
  currency: "ETH",
  explorerUrl: "https://sepolia-optimism.etherscan.io/",
  rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  // websocket: wss://opt-sepolia.g.alchemy.com/v2/
};

// const localhost = {
//   chainId: ANVIL_CHAIN_ID,
//   name: "Anvil Localhost",
//   currency: "ETH",
//   explorerUrl: "http://127.0.0.1:8545",
//   rpcUrl: "http://127.0.0.1:8545",
//   // websocket: wss://opt-sepolia.g.alchemy.com/v2/
// };

// const liskSepolia = {
//   chainId: LISK_CHAIN_ID,
//   name: "Lisk Sepolia Testnet",
//   currency: "ETH",
//   explorerUrl: "https://liskscan.com/",
//   rpcUrl: "http://127.0.0.1:8545",
//   // websocket: wss://opt-sepolia.g.alchemy.com/v2/
// };

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
    // ethereumSepolia,
    optimismSepolia,
    // localhost,
    // liskSepolia
  ],
  projectId: "35fadd8ea93791ac21f87e7fa5c5d0ec",
  enableOnramp: true,
  enableAnalytics: false,
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return children;
}
