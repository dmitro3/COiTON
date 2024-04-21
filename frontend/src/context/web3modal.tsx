"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { ReactNode } from "react";

// 1. Get projectId at https://cloud.walletconnect.com

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// 3. Create a metadata object
const metadata = {
  name: "COITON",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: `https://optimism-sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`, // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
  enableEmail: false,
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId: "33fbbd3bd8ca469dfba7bd6d5d3d2bfa",
  enableAnalytics: true,
  enableOnramp: true,
});

export function Web3ModalProvider({ children }: { children: ReactNode }) {
  return children;
}
