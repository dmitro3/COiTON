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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MaxWrapper from "@/components/shared/max-wrapper";
import { shortenAddress } from "@/lib/utils";
import { Handshake, Loader, ShoppingCart } from "lucide-react";
import { useFetchTradingMarket, useStake } from "@/hooks/contract";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

enum ACTION_TYPE {
  BUY,
  SELL,
}
const Comp = ({
  open,
  onChange,
  onSubmit,
  inputRef,
  type,
  tradingShares,
}: {
  open: boolean;
  onChange: any;
  onSubmit: any;
  inputRef: any;
  type: any;
  tradingShares: boolean;
}) => (
  <Sheet open={open} onOpenChange={(isOpen) => onChange(isOpen)}>
    <SheetContent>
      <SheetHeader className="space-y-0">
        <SheetTitle>
          {type === ACTION_TYPE.BUY
            ? "Buy Shares"
            : type === ACTION_TYPE.SELL
            ? "Sell Shares"
            : "Trade Shares"}
        </SheetTitle>
        <SheetDescription>
          Enter the number of shares you want to{" "}
          {type === ACTION_TYPE.BUY
            ? "purchase."
            : type === ACTION_TYPE.SELL
            ? "sell."
            : "trade."}
        </SheetDescription>
      </SheetHeader>
      <div className="flex flex-col gap-2 py-2">
        <div className="space-y-1">
          <Label htmlFor="shares" className="w-16 mt-3">
            Amount
          </Label>
          <Input
            ref={inputRef}
            id="shares"
            placeholder="10"
            className="h-10 flex-1"
            type="number"
          />
        </div>

        <div className="flex items-center justify-end w-full gap-2 text-right">
          {tradingShares ? (
            <Button
              type="button"
              size="icon"
              disabled={tradingShares}
              variant="outline">
              <Loader className="w-4 h-4 animate-spin" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled={tradingShares}
              onClick={onSubmit}>
              Transact
            </Button>
          )}
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default function TradingsPage() {
  const router = useRouter();
  const { handleApproveERC20 } = useStake();
  const { isFetchingData, market, isError, buyShares, sellShares } =
    useFetchTradingMarket();
  const [currentAction, setCurrentAction] = useState<null | ACTION_TYPE>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [tradingShares, setTradingShares] = useState(false);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<null | number>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const tradeShares = async () => {
    const shareValue = Number(inputRef.current?.value.trim());
    if (isNaN(shareValue)) return;
    if (shareValue > 100) return;
    if (selectedTokenIndex === null || currentAction === null) {
      setIsOpen(false);
      setCurrentAction(null);
      setSelectedTokenIndex(null);
      return;
    }
    try {
      setTradingShares(true);
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
    } catch (error: any) {
      console.log("ERROR TRADING SHARES: ", error);
    } finally {
      setTradingShares(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <Comp
        inputRef={inputRef}
        open={isOpen}
        type={currentAction}
        tradingShares={tradingShares}
        onSubmit={tradeShares}
        onChange={(_val: boolean) => {
          if (!_val) {
            setIsOpen(false);
            setSelectedTokenIndex(null);
            setCurrentAction(null);
          }
        }}
      />

      <MaxWrapper className="my-6 xl:my-6 px-0 lg:px-0 xl:px-0 2xl:px-4">
        <div className="hidden sm:flex flex-1">
          <Table>
            <TableHeader>
              <TableRow className="text-sm md:text-base font-semibold">
                <TableHead className="text-sm">#ID</TableHead>
                <TableHead className="hidden md:flex items-center text-sm">
                  Token Owner
                </TableHead>
                <TableHead className="text-sm">Current Price</TableHead>
                <TableHead className="text-sm">Available Shares</TableHead>
                <TableHead className="text-sm">Share Price</TableHead>
                <TableHead className="text-right text-sm"> </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingData
                ? Array.from({ length: 6 }).map((_, _key) => (
                    <TableRow key={_key}>
                      <TableCell>
                        <Skeleton className="w-full py-4" />
                      </TableCell>
                      <TableCell className="hidden md:flex">
                        <Skeleton className="w-full py-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-full py-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-full py-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-full py-4" />
                      </TableCell>
                      <TableCell className="w-[156px] xl:w-[253px]">
                        <Skeleton className="w-full py-4" />
                      </TableCell>
                    </TableRow>
                  ))
                : market.map((trades: any, _id: number) => (
                    <TableRow
                      key={_id}
                      onClick={() =>
                        router.push(`/listing/${trades?.listing?.id}`)
                      }
                      className="cursor-pointer group hover:bg-muted/20">
                      <TableCell className="py-2 font-medium group-hover:underline">
                        {trades.listing.tokenId < 9
                          ? `0${trades.listing.tokenId}`
                          : trades.listing.tokenId}
                      </TableCell>
                      <TableCell className="py-2 text-muted-foreground font-normal hidden md:flex">
                        {shortenAddress(trades.listing.owner)}
                      </TableCell>
                      <TableCell className="py-2 text-primary font-semibold">
                        $ {Number(trades.market.currentPrice).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-2 text-red-500 font-semibold">
                        {100 - Number(trades.market.consumedShares)}
                      </TableCell>
                      <TableCell className="py-2 text-orange-500 font-semibold">
                        ${" "}
                        {Math.round(
                          (Number(trades.market.currentPrice) * 1) / 100
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell className="py-2 flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                            setSelectedTokenIndex(_id);
                            setCurrentAction(ACTION_TYPE.BUY);
                          }}>
                          Buy
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                            setSelectedTokenIndex(_id);
                            setCurrentAction(ACTION_TYPE.SELL);
                          }}>
                          Sell
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-1 flex-col sm:hidden">
          {isFetchingData
            ? Array.from({ length: 6 }).map((_, _key) => (
                <Skeleton
                  className="w-full aspect-[1.7] mb-4 last:mb-0"
                  key={_key}></Skeleton>
              ))
            : market.map((trades: any, _id: number) => (
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
                      {Math.round(
                        (Number(trades.market.currentPrice) * 1) / 100
                      )}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <p className="text-sm w-full max-w-32"> </p>
                    <div className="flex flex-col gap-2 flex-1 mt-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        className="h-11"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(true);
                          setSelectedTokenIndex(_id);
                          setCurrentAction(ACTION_TYPE.BUY);
                        }}>
                        Purchase Shares
                      </Button>

                      <Button
                        variant="outline"
                        className="h-11"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(true);
                          setSelectedTokenIndex(_id);
                          setCurrentAction(ACTION_TYPE.SELL);
                        }}>
                        Trade in Shares
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
