"use client";

import { getDaoContract, getDiamondContract, getProvider } from "@/lib/utils";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { BrowserProvider, Contract, ethers } from "ethers";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import DIAMOND_CONTRACT_ABI from "../json/diamond.json";
import DAO_CONTRACT_ABI from '../json/dao.json';
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
      
      const tx = await contract.getUnApprovedAssigns("Plateau");
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
}

export const useApproveListing = (id:string) => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  async function fetchData() {
    setIsLoading(true);

    try {
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner(process.env.NEXT_PUBLIC_ADMIN_ADDRESS);
      const contract = getDaoContract(signer);

      const tx = await contract.approveListing(id)
      console.log(tx);
      // const contract = new ethers.Contract(process.env.NEXT_PUBLIC_DAO_CONTRACT as string, DAO_CONTRACT_ABI, ethers.provider);
      // const signer = await ethers.getSigner(process.env.NEXT_PUBLIC_ADMIN_ADDRESS);

      // const tx = await contract.connect(signer).approveListing(1);
      // await tx.wait(); // Wait for transaction to be mined

      // setListings(tx.status === 1);
      setIsApproved(true); // Set listings to true if transaction was successful
    } catch (error) {
      console.error(error); // Log any errors
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, isApproved };
};