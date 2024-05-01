"use client";

import { getDiamondContract, getProvider } from "@/lib/utils";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import DIAMOND_CONTRACT_ABI from "../json/diamond.json";
import { useRouter } from "next/navigation";

export const RENDER_ENDPOINT = "http://localhost:5000/api/v1";
// export const RENDER_ENDPOINT =
//   "https://decentralized-real-estate-trading.onrender.com/api/v1";

export const useFetchListings = () => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  async function fetchData() {
    setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      contract.on("CreatedListing", (owner, tokenId, price) => {
        let data = {
          owner,
          price,
          tokenId: tokenId.toNumber(),
        };

        console.log(data);
        fetchData();
      });
      const tx = await contract.getListings();
      setListings(tx);
    } catch (error: any) {
      console.log(error);

      if (error.reason === "rejected") {
        toast("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        console.log(error);
        toast(error.code, {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, listings };
};
