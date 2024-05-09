"use client";

import {
  getDaoContract,
  getDiamondContract,
  getERC20Contract,
  getERC721Contract,
  getProvider,
} from "@/connections";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RENDER_ENDPOINT = process.env.NEXT_PUBLIC_RENDER_ENDPOINT;

export const useFetchListings = () => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  async function getUserInitiatedPurchaseArgument(estateId: string) {
    // setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      const result = await contract.getUserInitiatedPurchaseArgument(signer.address, estateId);

      // console.log({ result })
      if (ethers.ZeroAddress === result[1]) {
        return { success: false, data: {} }

      }
      return { success: true, data: result };
      // const tx = await contract.getListings();
      // setListings(tx);
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
      return { success: false, data: {} }
    } finally {
      // setIsLoading(false);
    }
  }

  async function getEstateSigner(estateId: string) {
    // setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      const result = await contract.getEstateSigner(signer.address, estateId);

      // console.log({ result })
      if (ethers.ZeroAddress === result[0][1]) {
        return { success: false, data: {} }

      }
      return { success: true, data: result };
      // const tx = await contract.getListings();
      // setListings(tx);
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
      return { success: false, data: {} }
    } finally {
      // setIsLoading(false);
    }
  }


  async function signPurchaseAgreement(estateId: string, buyer: string, price: string, handleStake: (amount: string) => Promise<boolean>, handleStakeERC721: (tokenId: string) => Promise<boolean>) {
    // setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);
    // console.log({ buyer })
    try {

      let proceed = false;

      if (signer.address.toString() === buyer) {
        const hasApprovedERC20Token = await contract.checkIfApprovedERC20Token(estateId, signer.address);

        if (hasApprovedERC20Token) {
          proceed = true
        } else {
          proceed = await handleStake(price);
        }
      } else {
        const hasApprovedERC721Token = await contract.checkIfApprovedERC721Token(estateId);

        if (hasApprovedERC721Token) {
          proceed = true
        } else {
          proceed = await handleStakeERC721(estateId)
        }
      }
      if (!proceed) return;
      toast.loading("Processing transaction...");

      const tx = await contract.signPurchaseAgreement(estateId);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Signature successful");
      } else {
        toast.error("OOPS!!! Something went wrong!!")
      }

      toast.dismiss();


      // return { success: true, data: result };
      // const tx = await contract.getListings();
      // setListings(tx);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.reason ?? "Something went wrong")
      console.log(error);

      // if (error.reason === "rejected") {
      //   toast.error("Failed transaction", {
      //     description: "You rejected the transaction",
      //   });
      // } else {
      //   console.log(error);
      //   toast.error(error.code, {
      //     description: error.message,
      //   });
      // }
      // return { success: false, data: {} }
    } finally {
      // setIsLoading(false);
    }
  }



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
  return { isLoading, listings, getUserInitiatedPurchaseArgument, getEstateSigner, signPurchaseAgreement };
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

  const handleApproveERC20 = async (amount: string, receipient: string) => {
    setIsLoading(true);

    toast.loading("Approving transaction...");

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getERC20Contract(signer);

    try {
      const tx = await contract.approve(
        receipient,
        // process.env.NEXT_PUBLIC_DAO_ADDRESS,
        amount
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

  const handleApproveERC721 = async (tokenId: string, receipient: string) => {
    setIsLoading(true);

    toast.loading("Approving transaction...");

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getERC721Contract(signer);

    try {
      const tx = await contract.approve(
        receipient,
        tokenId
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

  return { handleApproveERC20, handleApproveERC721, isLoading };
};
