import { ethers } from "ethers";
import {
  DAO_CONTRACT_ABI,
  DIAMOND_CONTRACT_ABI,
  ERC20_CONTRACT_ABI,
  ERC721_CONTRACT_ABI,
} from "@/json";
import { variables } from "@/utils/env";

export let ethereum: any;
if (typeof window !== "undefined") ethereum = (window as any).ethereum;

export const getRequiredSigner = async () => {
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  if (typeof ethereum.request !== "function") {
    throw new Error("MetaMask does not support ethereum.request method");
  }

  try {
    const accounts = await ethereum.request({ method: "eth_accounts" });

    let provider;
    let signer;

    if (accounts?.length > 0) {
      provider = new ethers.BrowserProvider(ethereum);
      signer = await provider.getSigner();
      return signer;
    } else {
      provider = new ethers.JsonRpcProvider(variables.rpcUrl);
      const wallet = ethers.Wallet.createRandom();
      signer = wallet.connect(provider);
      return signer;
    }
  } catch (error) {
    console.error("Error getting SIGNER:", error);
    throw new Error("Failed to get SIGNER");
  }
};

export const getDiamondContract = async () => {
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(
      variables.diamondAddress,
      DIAMOND_CONTRACT_ABI,
      signer
    );
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};

export const getDAOContract = async () => {
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(
      variables.daoAddress,
      DAO_CONTRACT_ABI,
      signer
    );
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};

export const getERC20Contract = async () => {
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(
      variables.erc20Address,
      ERC20_CONTRACT_ABI,
      signer
    );
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};

export const getERC721Contract = async () => {
  if (!ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const signer = await getRequiredSigner();

    const contracts = new ethers.Contract(
      variables.erc721Address,
      ERC721_CONTRACT_ABI,
      signer
    );
    return contracts;
  } catch (error) {
    console.error("Error getting Ethereum contracts:", error);
    throw new Error("Failed to get Ethereum contracts");
  }
};
