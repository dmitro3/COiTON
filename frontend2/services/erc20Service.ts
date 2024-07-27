import {
  ethereum,
  getDiamondContract,
  getERC20Contract,
  getRequiredSigner,
} from "@/services";
import { variables } from "@/utils/env";

export const checkIfUserHasStaked = async (spender: string) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getERC20Contract();

    const allowance = await contract.allowance(spender, variables.daoAddress);
    return Number(allowance.toString()) >= 20e18;
  } catch (error) {
    reportError(error);
    throw error;
  }
};

export const approveERC20 = async ({
  recipient,
  amount,
}: {
  recipient: string;
  amount: string;
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getERC20Contract();

    const transaction = await contract.approve(recipient, amount);
    const receipt = await transaction.wait();

    if (!receipt.status) {
      throw new Error("Transaction failed");
    }

    return receipt;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};

export const buyShares = async ({
  estateId,
  shares,
  price,
  handleStake,
}: {
  estateId: string;
  shares: string;
  price: string;
  handleStake: (amount: string) => Promise<boolean>;
}) => {
  if (!ethereum) {
    throw new Error("Please install a browser provider");
  }

  try {
    const contract = await getDiamondContract();
    const signer = await getRequiredSigner();
    const erc20 = await getERC20Contract();

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

    const transaction = await contract.buyNFTTokenShares(estateId, shares);
    const receipt = await transaction.wait();

    if (!receipt.status) {
      throw new Error("Transaction failed");
    }

    return receipt;
  } catch (error: any) {
    reportError(error);
    if (error.reason === "rejected") {
      throw new Error("Transaction rejected");
    } else {
      throw new Error(error.message);
    }
  }
};
