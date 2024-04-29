"use client";

import { getDiamondContract, getProvider } from "@/lib/utils";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RENDER_ENDPOINT = process.env.NEXT_PUBLIC_RENDER_ENDPOINT;

export const useFetchListings = () => {
  const { walletProvider } = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<SingleListingType[]>();

  async function fetchData() {
    setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      const tx = await contract.getListings();
      setListings(tx);
      console.log(tx);
    } catch (error: any) {
      console.log(error);

      if (error.reason === "rejected") {
        toast("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        console.log(error);
        toast("Error transaction", {
          description: error,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, listings };
};
