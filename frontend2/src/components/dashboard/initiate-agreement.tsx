"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowRight, Plus, X } from "lucide-react";
import { useAuthContext } from "@/providers/authcontext";
import { toast } from "sonner";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import DIAMOND_CONTRACT_ABI from "@/json/diamond.json";
import { cn } from "@/lib/utils";

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
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buyers, setBuyers] = useState([{ id: 1, value: "" }]);

  const buyerAddress = inputRef.current?.value.trim();

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
    if (!buyerAddress) return;
    if (loading) return;
    if (agentId.toString() != address?.toString()) {
      toast.error("NOT_AUTHORIZED");
      return;
    }

    toast.loading("Processing transaction...");
    setLoading(true);
    try {
      const initiateAgreement = writeContract({
        abi: DIAMOND_CONTRACT_ABI,
        address: `0x${process.env.NEXT_PUBLIC_DIAMOND_ADDRESS}`,
        functionName: "initiatePurchaseAgreement",
        args: [estateId, buyerAddress, [buyerAddress, address]],
      });

      console.log(initiateAgreement);
      toast.success("SUCCESS");
      callback(true, {
        buyer: buyerAddress,
        signers: [buyerAddress, address],
      });
    } catch (error) {
      console.log(error);
      callback(false, null);
    } finally {
      toast.dismiss();
      setLoading(false);
    }
  };

  return (
    <div>
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
              Please include the addresses of the buyers with whom you wish to
              get into an arrangement.
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
              <Button type="submit" disabled={loading} onClick={handleSubmit}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
