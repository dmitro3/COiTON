"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useContractContext } from "@/providers/contract";
import { useRouter } from "next/navigation";
import MaxWrapper from "@/components/shared/max-wrapper";
import { shortenAddress } from "@/lib/utils";
import { Handshake, ShoppingCart } from "lucide-react";
import { useFetchTradingMarket, useStake } from "@/hooks";

enum ACTION_TYPE {
  BUY,
  Sell,
}
const Comp = ({
  open,
  onChange,
  onSubmit,
  inputRef,
}: {
  open: boolean;
  onChange: any;
  onSubmit: any;
  inputRef: any;
}) => (
  <Dialog open={open} onOpenChange={(isOpen) => onChange(isOpen)}>
    {/* <DialogTrigger asChild>
      <Button>Initiate Transaction</Button>
    </DialogTrigger> */}
    <DialogContent className="sm:max-w-[525px]">
      <DialogHeader>
        <DialogTitle>Buy shares</DialogTitle>
        <DialogDescription>
          Initiate a new purchase transaction
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Input
            ref={inputRef}
            id="shares"
            placeholder="shares"
            type="number"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} type="submit">
          Buy
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function TradingsPage() {
  const router = useRouter();
  const { handleApproveERC20 } = useStake();
  const { isFetchingData, market, isError, buyShares, sellShares } =
    useFetchTradingMarket();
  const [currentAction, setCurrentAction] = useState<null | ACTION_TYPE>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<null | number>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <Comp
        inputRef={inputRef}
        open={isOpen}
        onChange={(_val: boolean) => {
          if (!_val) {
            setIsOpen(false);
            setSelectedTokenIndex(null);
            setCurrentAction(null);
          }
        }}
        onSubmit={async () => {
          const shareValue = Number(inputRef.current?.value.trim());
          if (isNaN(shareValue)) return;
          if (shareValue > 100) return;
          if (selectedTokenIndex === null || currentAction === null) {
            setIsOpen(false);
            setCurrentAction(null);
            setSelectedTokenIndex(null);
            return;
          }
          if (currentAction === ACTION_TYPE.BUY) {
            if (
              shareValue >
              100 - Number(market[selectedTokenIndex].market.consumedShares)
            ) {
              toast.warning("Cannot exceed available shares");
              return;
            }
            await buyShares(
              market[selectedTokenIndex].listing.tokenId,
              shareValue.toString(),
              market[selectedTokenIndex].market.currentPrice,
              (_val: string) =>
                handleApproveERC20(
                  _val,
                  process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string
                )
            );
          } else {
            await sellShares(
              market[selectedTokenIndex].listing.tokenId,
              shareValue.toString()
            );
          }

          setIsOpen(false);
          setSelectedTokenIndex(null);
          setCurrentAction(null);
        }}
      />

      <MaxWrapper className="my-6 xl:my-6 px-0 lg:px-0 xl:px-0 2xl:px-4">
        <div className="hidden sm:flex flex-1">
          <Table>
            <TableHeader>
              <TableRow className="text-sm md:text-base font-semibold">
                <TableHead>#ID</TableHead>
                <TableHead className="hidden md:flex items-center">
                  Token Owner
                </TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead>Available Shares</TableHead>
                <TableHead>Share Price</TableHead>
                <TableHead className="text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {market.map((trades: any, _id: number) => (
                <TableRow
                  key={_id}
                  onClick={() => router.push(`/listing/${trades?.listing?.id}`)}
                  className="cursor-pointer group">
                  <TableCell className="py-2 font-medium group-hover:underline">
                    {trades.listing.tokenId < 9
                      ? `0${trades.listing.tokenId}`
                      : trades.listing.tokenId}
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground font-normal hidden md:flex">
                    {shortenAddress(trades.listing.owner)}
                  </TableCell>
                  <TableCell className="py-2 text-primary font-semibold">
                    ₦ {Number(trades.market.currentPrice).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-2 text-red-500 font-semibold">
                    {100 - Number(trades.market.consumedShares)}
                  </TableCell>
                  <TableCell className="py-2 text-orange-500 font-semibold">
                    ₦{" "}
                    {Math.round(
                      (Number(trades.market.currentPrice) * 1) / 100
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-2 flex items-center justify-end gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                        setSelectedTokenIndex(_id);
                        setCurrentAction(ACTION_TYPE.BUY);
                      }}>
                      <ShoppingCart className="w-4 h-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                        setSelectedTokenIndex(_id);
                        setCurrentAction(ACTION_TYPE.Sell);
                      }}>
                      <Handshake className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-1 flex-col sm:hidden">
          {market.map((trades: any, _id: number) => (
            <div
              key={_id}
              className="flex flex-col gap-2 border-b last:border-b-0 py-4 first:pt-0 last:pb-0">
              <div className="flex items-start">
                <p className="text-sm w-full max-w-32">Token ID</p>
                <p className="text-sm text-muted-foreground">
                  {trades.listing.tokenId}
                </p>
              </div>
              <div className="flex items-start">
                <p className="text-sm w-full max-w-32">Token Owner</p>
                <p className="text-sm text-muted-foreground">
                  {shortenAddress(trades.listing.owner)}
                </p>
              </div>
              <div className="flex items-start">
                <p className="text-sm w-full max-w-32">Current Price</p>
                <p className="text-sm text-primary">
                  {trades.market.currentPrice}
                </p>
              </div>
              <div className="flex items-start">
                <p className="text-sm w-full max-w-32">Available Shares</p>
                <p className="text-sm text-red-500">
                  {100 - Number(trades.market.consumedShares)}
                </p>
              </div>
              <div className="flex items-start">
                <p className="text-sm w-full max-w-32">Share Price</p>
                <p className="text-sm text-orange-500">
                  {Math.round((Number(trades.market.currentPrice) * 1) / 100)}
                </p>
              </div>
              <div className="flex items-start">
                <p className="text-sm w-full max-w-32"> </p>
                <div className="flex flex-col gap-2 flex-1 mt-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(true);
                      setSelectedTokenIndex(_id);
                      setCurrentAction(ACTION_TYPE.BUY);
                    }}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(true);
                      setSelectedTokenIndex(_id);
                      setCurrentAction(ACTION_TYPE.Sell);
                    }}>
                    <Handshake className="w-4 h-4 mr-2" />
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MaxWrapper>
    </div>
  );
}
