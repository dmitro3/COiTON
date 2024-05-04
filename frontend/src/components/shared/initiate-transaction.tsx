import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getDiamondContract, getProvider } from "@/connections";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";

export const InitiatePurchaseTransaction = ({
  agentId,
  estateId
}: {
  agentId: string;
  estateId: string;
}) => {
  const { walletProvider }: any = useWeb3ModalProvider();
  const { address } = useWeb3ModalAccount();

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const initiatePurchaseTransaction = async () => {
    try {
      const buyerAddress = inputRef.current?.value.trim();
      if (!buyerAddress) return;
      if (loading) return;
      if (agentId.toString() != address?.toString()) {
        toast.error("NOT_AUTHORIZED");
        return;
      }
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner(
        process.env.NEXT_PUBLIC_ADMIN_ADDRESS
      );
      const contract = getDiamondContract(signer);
      toast.loading("Uploading files to IPFS...");
      // console.log(estateId);
      // return;
      const tx = await contract.initiatePurchaseAgreement(estateId, buyerAddress, [buyerAddress, address]);

      const tx_receipt = await tx.wait();

      if (tx_receipt.status) {
        toast.success("SUCCESS");
      } else {
        toast.error(tx_receipt.reason ?? "OOPS!!! SOMETHING WENT WRONG");
      }
      setLoading(false);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      console.log(error);
    }
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Initiate Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Initiate Purchase Transaction</DialogTitle>
          <DialogDescription>
            Initiate a new purchase transaction
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Agent
            </Label>
            <Input
              id="address"
              type="text"
              value={agentId}
              disabled={!!agentId}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="amount" className="text-right">
              Buyers
            </Label>
            <Textarea
              ref={inputRef}
              cols={8}
              rows={8}
              placeholder="Add the number of buyers"
              className="bg-secondary/20 col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={initiatePurchaseTransaction} type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
