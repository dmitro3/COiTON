"use client";

import { getDaoContract, getDiamondContract, getProvider } from "@/connections";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RENDER_ENDPOINT = process.env.NEXT_PUBLIC_RENDER_ENDPOINT;

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
      const tx = await contract.getListings();
      setListings(tx);
    } catch (error: any) {
      console.log(error);

      if (error.reason === "rejected") {
        toast.error("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        console.log(error);
        toast.error(error.code, {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchDataAndListen = async () => {
      await fetchData();

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getDiamondContract(signer);

      contract.on("CreatedListing", async (owner, tokenId, price) => {
        await fetchData();
      });

      return () => {
        contract.removeAllListeners("CreatedListing");
      };
    };

    fetchDataAndListen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, listings };
};

export const useFetchUnApprovedListings = () => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  async function fetchData() {
    setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDaoContract(signer);

    try {
      const tx = await contract.getUnApprovedAssigns("Kaduna");
      const receipt = await tx.wait();

      if (receipt.status) {
        console.log(tx);

        setListings(tx);
        return;
      } else {
        return toast.error("Could not get UnApproved listings");
      }
    } catch (error: any) {
      console.log(error);

      if (error.reason === "rejected") {
        toast.error("Failed transaction", {
          description: "You rejected the transaction",
        });
      } else {
        console.log(error);
        toast.error(error.code, {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchDataAndListen = async () => {
      await fetchData();

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getDiamondContract(signer);

      contract.on("CreatedListing", async (owner, tokenId, price) => {
        await fetchData();
      });

      return () => {
        contract.removeAllListeners("CreatedListing");
      };
    };

    fetchDataAndListen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isLoading, listings };
};
