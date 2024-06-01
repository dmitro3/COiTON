import { ethers } from "ethers";
import {
  DAO_CONTRACT_ABI,
  DIAMOND_CONTRACT_ABI,
  ERC20_CONTRACT_ABI,
  ERC721_CONTRACT_ABI,
} from "@/json";

export const getDiamondContract = (providerOrSigner: any) =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string,
    DIAMOND_CONTRACT_ABI,
    providerOrSigner
  );

export const getDaoContract = (providerOrSigner: any) =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_DAO_ADDRESS as string,
    DAO_CONTRACT_ABI,
    providerOrSigner
  );

export const getERC20Contract = (providerOrSigner: any) =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_ERC20_ADDRESS as string,
    ERC20_CONTRACT_ABI,
    providerOrSigner
  );

export const getERC721Contract = (providerOrSigner: any) =>
  new ethers.Contract(
    process.env.NEXT_PUBLIC_ERC721_ADDRESS as string,
    ERC721_CONTRACT_ABI,
    providerOrSigner
  );

// read only provider pointing to sepolia. It allows read only access to the sepolia blockchain
export const readOnlyProvider = new ethers.JsonRpcProvider(
  // `http://127.0.0.1:8545`
  // `https://opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  // `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
  "https://api.avax-test.network/ext/bc/C/rpc"
);

// read/write provider, that allows you to read data and also sign transaction on whatever chain it's pointing to
export const getProvider = (provider: any) =>
  new ethers.BrowserProvider(provider);
