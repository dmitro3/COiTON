import { ethers } from "ethers";

import DIAMOND_CONTRACT_ABI from "../json/diamond.json";
import DAO_CONTRACT_ABI from "../json/dao.json";

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

// read only provider pointing to sepolia. It allows read only access to the sepolia blockchain
export const readOnlyProvider = new ethers.JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
);

// read/write provider, that allows you to read data and also sign transaction on whatever chain it's pointing to
export const getProvider = (provider: any) =>
  new ethers.BrowserProvider(provider);
