import { Button } from "@/components/ui/button";
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

export default function TradingsPage() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">
        Latest Trades
      </h1>

      <div className="my-2">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className="text-sm md:text-base font-semibold">
              <TableHead className="w-[150px]">Token</TableHead>
              <TableHead>Buy</TableHead>
              <TableHead>Sell</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tradings.map((trades, _id) => (
              <TableRow key={_id}>
                <TableCell className="h-12 font-medium">
                  {trades.token}
                </TableCell>
                <TableCell className="h-12 text-green-500 font-semibold">
                  {trades.buy}
                </TableCell>
                <TableCell className="h-12 text-red-500 font-semibold">
                  {trades.sell}
                </TableCell>
                <TableCell>{trades.amount}</TableCell>
                <TableCell className="h-12 flex items-center justify-end gap-4">
                  <p>Buy</p>
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
