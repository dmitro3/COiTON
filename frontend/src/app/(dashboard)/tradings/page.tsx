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
import { useFetchTradingMarket, useStake } from "@/hooks/useFetchBackend";
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

const tradings = [
  {
    token: "CTN",
    buy: "$150",
    sell: "$250.00",
    amount: "10",
  },
  {
    token: "CTN",
    buy: "$150",
    sell: "$250.00",
    amount: "10",
  },
  {
    token: "CTN",
    buy: "$150",
    sell: "$250.00",
    amount: "10",
  },
  {
    token: "CTN",
    buy: "$150",
    sell: "$250.00",
    amount: "10",
  },
  {
    token: "CTN",
    buy: "$150",
    sell: "$250.00",
    amount: "10",
  },
  {
    token: "CTN",
    buy: "$150",
    sell: "$250.00",
    amount: "10",
  },
];

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
  const { handleApproveERC20 } = useStake();
  const { isFetchingData, market, isError, buyShares } =
    useFetchTradingMarket();
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
          }
        }}
        onSubmit={async () => {
          const shareValue = Number(inputRef.current?.value.trim());
          if (isNaN(shareValue)) return;
          if (shareValue > 100) return;
          if (selectedTokenIndex === null) {
            setIsOpen(false);
            return;
          }
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

          setIsOpen(false);
          setSelectedTokenIndex(null);
        }}
      />
      <h1 className="text-xl md:text-2xl capitalize font-bold">Tradings</h1>

      <div className="my-2 rounded-xl bg-secondary/30 flex-1 py-4 px-6">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className="text-sm md:text-base font-semibold">
              <TableHead className="w-[150px]">Token ID</TableHead>
              <TableHead>Current Price</TableHead>
              <TableHead>Available Shares</TableHead>
              <TableHead>Share Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {market.map((trades, _id) => (
              <TableRow key={_id}>
                <TableCell className="h-12 font-medium">
                  {trades.listing.tokenId}
                </TableCell>
                <TableCell className="h-12 text-green-500 font-semibold">
                  {trades.market.currentPrice}
                </TableCell>
                <TableCell className="h-12 text-red-500 font-semibold">
                  {100 - Number(trades.market.consumedShares)}
                </TableCell>
                <TableCell>
                  {Math.round((Number(trades.market.currentPrice) * 1) / 100)}
                </TableCell>
                <TableCell className="h-12 flex items-center justify-end gap-4">
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedTokenIndex(_id);
                    }}
                  >
                    Buy
                  </button>
                  <p>Sell</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
