"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, Loader, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { getDiamondContract, getProvider } from "@/connections";
import { useAuth } from "@/context/authContext";

export default function InitiatePurchaseAgreement({
  agentId,
  estateId,
  callback,
}: {
  agentId: string;
  estateId: string;
  callback: (
    success: boolean,
    data: null | { buyer: string; signers: string[] }
  ) => void;
}) {
  const { credentials } = useAuth();
  const { walletProvider }: any = useWeb3ModalProvider();

  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buyers, setBuyers] = useState([{ id: 1, value: "" }]);

  // const buyerAddress = inputRef.current?.value.trim();

  const addBuyer = () => {
    const newBuyer = { id: buyers.length + 1, value: "" };
    setBuyers([...buyers, newBuyer]);
  };

  const removeBuyer = (id: number) => {
    if (buyers.length > 1) {
      setBuyers(buyers.filter((buyer) => buyer.id !== id));
    }
  };

  const handleBuyerChange = (id: number, value: any) => {
    setBuyers(
      buyers.map((buyer) => (buyer.id === id ? { ...buyer, value } : buyer))
    );
  };

  const handleSubmit = async () => {
    try {
      const buyerAddress = inputRef.current?.value.trim();
      if (!buyerAddress) return;
      if (loading) return;
      if (agentId.toString() != credentials?.address?.toString()) {
        toast.error("NOT_AUTHORIZED");
        return;
      }
      setLoading(true);

      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner(
        process.env.NEXT_PUBLIC_ADMIN_ADDRESS
      );
      const contract = getDiamondContract(signer);
      toast.loading("Processing transaction...");
      // console.log(estateId);
      // return;
      const tx = await contract.initiatePurchaseAgreement(
        estateId,
        buyerAddress,
        [buyerAddress, credentials?.address]
      );

      const tx_receipt = await tx.wait();

      if (tx_receipt.status) {
        toast.success("SUCCESS");
        callback(true, {
          buyer: buyerAddress,
          signers: [buyerAddress, credentials?.address],
        });
      } else {
        toast.error(tx_receipt.reason ?? "OOPS!!! SOMETHING WENT WRONG");
        callback(false, null);
      }
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      console.log(error);
      callback(false, null);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">
          Initiate Agreement <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Initiate Agreement</SheetTitle>
          <SheetDescription>
            Please include the addresses of the buyers with whom you wish to get
            into an arrangement.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-row items-start">
            <Label htmlFor="agent" className="w-16 mt-3">
              Agent
            </Label>
            <Input
              value={agentId}
              disabled={!!agentId}
              className="h-10 flex-1"
              id="agent"
              readOnly
            />
          </div>

          <div className="flex flex-row items-start w-full">
            <Label htmlFor="buyer" className="w-16 mt-3">
              Buyers
            </Label>
            <div className="flex flex-col gap-2 flex-1">
              {buyers.map((buyer, index) => (
                <div key={buyer.id} className="fw-full h-max relative">
                  <Input
                    id={`buyer-${buyer.id}`}
                    value={buyer.value}
                    ref={index === 0 ? inputRef : null}
                    type="text"
                    autoComplete="off"
                    className={cn("h-10 w-full", {
                      "pr-8": index > 0,
                    })}
                    onChange={(e) =>
                      handleBuyerChange(buyer.id, e.target.value)
                    }
                  />
                  {index > 0 && (
                    <X
                      onClick={() => removeBuyer(buyer.id)}
                      className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-2 text-right">
            <Button
              onClick={addBuyer}
              type="button"
              size="icon"
              disabled
              variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
            {loading ? (
              <Button
                onClick={addBuyer}
                type="button"
                size="icon"
                disabled={loading}
                variant="outline">
                <Loader className="w-4 h-4 animate-spin" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} onClick={handleSubmit}>
                Create
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
