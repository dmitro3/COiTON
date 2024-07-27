import { ethereum, getERC20Contract } from "@/services";

export const approveERC721 = async ({
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
