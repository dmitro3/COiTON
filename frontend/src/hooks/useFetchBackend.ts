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

export const useFetchListings = (shouldFetchData: boolean) => {
  const { walletProvider }: any = useWeb3ModalProvider();

  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<any>();

  async function getUserInitiatedPurchaseArgument(estateId: string) {
    // setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      const result = await contract.getUserInitiatedPurchaseArgument(
        signer.address,
        estateId
      );

      // console.log({ result })
      if (ethers.ZeroAddress === result[1]) {
        return { success: false, data: {} };
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
      return { success: false, data: {} };
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
        return { success: false, data: {} };
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
      return { success: false, data: {} };
    } finally {
      // setIsLoading(false);
    }
  }

  async function signPurchaseAgreement(
    estateId: string,
    buyer: string,
    price: string,
    handleStake: (amount: string) => Promise<boolean>,
    handleStakeERC721: (tokenId: string) => Promise<boolean>
  ) {
    // setIsLoading(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);
    // console.log({ buyer })
    try {
      let proceed = false;

      if (signer.address.toString() === buyer) {
        const hasApprovedERC20Token = await contract.checkIfApprovedERC20Token(
          estateId,
          signer.address
        );

        if (hasApprovedERC20Token) {
          proceed = true;
        } else {
          proceed = await handleStake(price);
        }
      } else {
        const hasApprovedERC721Token =
          await contract.checkIfApprovedERC721Token(estateId);

        if (hasApprovedERC721Token) {
          proceed = true;
        } else {
          proceed = await handleStakeERC721(estateId);
        }
      }
      if (!proceed) return;
      toast.loading("Processing transaction...");

      const tx = await contract.signPurchaseAgreement(estateId);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Signature successful");
      } else {
        toast.error("OOPS!!! Something went wrong!!");
      }

      toast.dismiss();

      // return { success: true, data: result };
      // const tx = await contract.getListings();
      // setListings(tx);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.reason ?? "Something went wrong");
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
    if (!shouldFetchData) return;
    console.log("++++++++++++=================================>>>>");
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
  return {
    isLoading,
    listings,
    getUserInitiatedPurchaseArgument,
    getEstateSigner,
    signPurchaseAgreement,
  };
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
      const tx = await contract.getUnApprovedAssigns("Abia");

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
      const tx = await contract.approve(receipient, tokenId);
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

export const useFetchAllAgreements = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [allAgreements, setAllAgreements] = useState<AgreementType[]>([]);
  const [isError, setIsError] = useState("");

  const [isFetchingAgreements, setIsFetchingAgreements] =
    useState<boolean>(false);

  const fetchData = async () => {
    setIsFetchingAgreements(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      const transformListing = (listing: any) => ({
        id: listing[0],
        owner: listing[1],
        region: listing[2],
        postalCode: Number(listing[3]),
        description: listing[4].split(";")[0],
        features: listing[4].split(";")[1].split("\n"),
        price: Number(listing[5]),
        images: listing[6].split(";"),
        tokenId: listing[7],
        coverImage: listing[8],
        createdAt: Number(listing[9]),
      });

      const tx = await contract.getPurchaseAgreementSigners(signer.address);
      // console.log(tx[0][0].executed);
      const dt = {
        agr: tx[0],
        hasSigned: tx[1],
        listings: tx[2],
      };

      const data = dt.agr.map((d: any) => {
        const bb = {
          id: Number(d[0]),
          initiator: d[1],
          buyer: d[2],
          estateId: Number(d[3]),
          signersCount: Number(d[4]),
          executed: d[5],
          validSigners: d[6],
        };

        return bb;
      });
      const listings = dt.listings.map(transformListing);

      const signed = dt.hasSigned.map((d: any) => d);

      const allAgreements = data
        ?.reverse()
        ?.map((item: any, index: number) => ({
          ...item,
          // linking signed status with corresponding data item based on its index
          signed: signed[index],
          listing: listings[index],
        }));

      setAllAgreements(allAgreements);
    } catch (error: any) {
      console.log(error);
      toast.error(error.code, {
        description: error.message,
      });

      setIsError(error.message);
    } finally {
      setIsFetchingAgreements(false);
    }
  };

  useEffect(() => {
    const listenForEvents = async () => {
      await fetchData();

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getDiamondContract(signer);

      contract.on(
        "PurchaseAgreementInitialization",
        async (estateId, initiator, signers) => {
          await fetchData();
        }
      );

      return () => {
        contract.removeAllListeners("PurchaseAgreementInitialization");
      };
    };

    listenForEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { allAgreements, isFetchingAgreements, isError };
};

export const useFetchTradingMarket = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [market, setMarket] = useState<any[]>([]);
  const [isError, setIsError] = useState("");

  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const fetchData = async () => {
    setIsFetchingData(true);

    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);

    try {
      const tx = await contract.getMarket();

      const processed = tx.map((mp: any) => ({
        market: {
          tokenId: mp[0].tokenId.toString(),
          currentPrice: mp[0].currentPrice.toString(),
          consumedShares: mp[0].consumedShares.toString(),
          stakeHolders: mp[0].stakeHolders,
        },
        listing: {
          id: mp[1].id,
          owner: mp[1].owner,
          region: mp[1].region,
          postalCode: mp[1].postalCode.toString(),
          description: mp[1].description,
          price: mp[1].price.toString(),
          images: mp[1].images,
          tokenId: mp[1].tokenId.toString(),
          coverImage: mp[1].coverImage,
          createdAt: mp[1].createdAt.toString(),
        },
      }));
      setMarket(processed);
    } catch (error: any) {
      console.log(error);
      toast.error(error.code, {
        description: error.message,
      });

      setIsError(error.message);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    const listenForEvents = async () => {
      await fetchData();

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
      const contract = getDiamondContract(signer);

      contract.on("CreatedListing", async () => {
        await fetchData();
      });

      contract.on("BuyShares", async () => {
        await fetchData();
      });
      contract.on("SellShares", async () => {
        await fetchData();
      });

      return () => {
        contract.removeAllListeners("CreatedListing");
        contract.removeAllListeners("BuyShares");
        contract.removeAllListeners("SellShares");
      };
    };

    listenForEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function buyShares(
    estateId: string,
    shares: string,
    price: string,
    handleStake: (amount: string) => Promise<boolean>
  ) {
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);
    const erc20 = getERC20Contract(signer);
    try {
      let proceed = false;
      const SHARE_PRICE = Math.round((Number(price) * Number(shares)) / 100);
      const hasStake = await contract.checkStake(signer.address);

      if (Number(hasStake.toString()) >= SHARE_PRICE) {
        proceed = true;
      } else {
        const checkAllowance = await erc20.allowance(
          signer.address,
          process.env.NEXT_PUBLIC_DIAMOND_ADDRESS
        );

        if (Number(checkAllowance.toString()) < SHARE_PRICE) {
          const approve = await handleStake(
            (SHARE_PRICE - Number(checkAllowance.toString())).toString()
          );

          if (approve) {
            const stakeToken = await (await contract.stake(SHARE_PRICE)).wait();
            proceed = !!stakeToken.status;
          } else {
            proceed = false;
          }
        } else {
          const stakeToken = await (await contract.stake(SHARE_PRICE)).wait();
          proceed = !!stakeToken.status;
        }
      }

      if (!proceed) return;
      toast.loading("Processing transaction...");

      const tx = await contract.buyNFTTokenShares(estateId, shares);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Buy successful");
      } else {
        toast.error("OOPS!!! Something went wrong!!");
      }

      toast.dismiss();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.reason ?? "Something went wrong");
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  }

  async function sellShares(estateId: string, shares: string) {
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner();
    const contract = getDiamondContract(signer);
    try {
      toast.loading("Processing transaction...");

      const tx = await contract.sellNFTTokenShares(estateId, shares);
      const receipt = await tx.wait();

      if (receipt.status) {
        toast.success("Sell successful");
      } else {
        toast.error("OOPS!!! Something went wrong!!");
      }

      toast.dismiss();
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.reason ?? "Something went wrong");
      console.log(error);
    } finally {
      // setIsLoading(false);
    }
  }

  return { market, isFetchingData, isError, buyShares, sellShares };
};
