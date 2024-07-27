"use client";

import { useState } from "react";
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
import { Loader, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import { initiatePurchaseAgreement } from "@/services/diamondService";
import { toast } from "sonner";
import { useAuth } from "@/providers/authprovider";

export default function InitiatePurchaseAgreement({
  agentId,
  estateId,
  callback,
  disabled,
  children,
}: {
  agentId: string;
  estateId: string;
  disabled: any;
  callback: (
    success: boolean,
    data: null | { buyer: string; signers: string[] }
  ) => void;
  children: React.ReactNode;
}) {
  const { credentials } = useAuth();

  const [buyers, setBuyers] = useState<string[]>([]);
  const [newBuyer, setNewBuyer] = useState<string>("");
  const [isInitiatingTx, setIsInitiatingTx] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newBuyer.trim()) {
      setBuyers([...buyers, newBuyer]);
      setNewBuyer("");
    }
  };

  const handleRemoveBuyer = (index: number) => {
    const updatedBuyers = buyers.filter((_, i) => i !== index);
    setBuyers(updatedBuyers);
  };

  const handleInitiate = async () => {
    if (!agentId) return;
    if (buyers.length === 0) return;

    try {
      setIsInitiatingTx(true);
      const data = await initiatePurchaseAgreement({
        estateId: Number(estateId),
        buyer: agentId,
        signers: [credentials?.address, ...buyers],
      });
      if (data) {
        toast.success("Agreement initiated");
        callback(true, {
          buyer: agentId,
          signers: [credentials?.address, ...buyers],
        });
      }
    } catch (error: any) {
      toast.error("OOPS!!! SOMETHING WENT WRONG");
      console.log(error);
      callback(false, null);
    } finally {
      setIsInitiatingTx(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild disabled={disabled}>
        {children}
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
              disabled={!!agentId || isInitiatingTx}
              className="h-10 flex-1 text-foreground"
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
                <div className="w-full h-max relative" key={index}>
                  <Input
                    id={`buyer-${index}`}
                    type="text"
                    value={buyer}
                    disabled={isInitiatingTx}
                    readOnly
                    className={cn("h-10 w-full text-foreground", {
                      "pr-8": true,
                    })}
                  />
                  <X
                    className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                    onClick={() => handleRemoveBuyer(index)}
                  />
                </div>
              ))}
              <div className="w-full h-max relative">
                <Input
                  id="new-buyer"
                  type="text"
                  value={newBuyer}
                  disabled={isInitiatingTx}
                  onChange={(e) => setNewBuyer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add new buyer..."
                  className={cn("h-10 w-full text-foreground", {
                    "pr-8": true,
                  })}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-2 text-right">
            <Button
              type="button"
              size={"sm"}
              onClick={handleInitiate}
              disabled={isInitiatingTx}>
              {isInitiatingTx ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" /> Initiating...
                </>
              ) : (
                "Initiate"
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
