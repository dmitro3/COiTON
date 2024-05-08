"use client";

import {
  getDaoContract,
  getDiamondContract,
  getERC20Contract,
  getProvider,
} from "@/connections";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
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
      const tx = await contract.getUnApprovedAssigns("Lagos");

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

export const useCheckIfUserStaked = () => {
  const { walletProvider }: any = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  const [isLoading, setIsLoading] = useState(true);

  async function checkIsStaked() {
    setIsLoading(true);
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getERC20Contract(signer);

    // console.log({ allowance });
    // const contract = getDaoContract(signer);

    try {
      // const tx = await contract.getUserStake(address);
      const allowance = await contract.allowance(
        signer.address,
        process.env.NEXT_PUBLIC_DAO_ADDRESS
      );
      return Number(allowance.toString()) >= 20e18;
    } catch (error: any) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, checkIsStaked };
};

export const useStake = () => {
  const { walletProvider }: any = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  const [isLoading, setIsLoading] = useState(false);

  const handleStake = async () => {
    setIsLoading(true);

    toast.loading("Approving transaction...");

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getERC20Contract(signer);

    try {
      const tx = await contract.approve(
        process.env.NEXT_PUBLIC_DAO_ADDRESS,
        (20e18).toString()
      );
      const result = await tx.wait();

      if (result.status === 0) {
        toast.error("Transaction failed");
        return false;
      } else {
        toast.success("Transaction approved successfully");
        return true;
      }
    } catch (error: any) {
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  return { handleStake, isLoading };
};
