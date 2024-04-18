import MaxWrapper from "@/components/shared/wrapper";
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

const transactions = [
  {
    token: "UXC",
    type: "Bungalo",
    amount: "$250.00",
    timestamp: "10923",
  },
  {
    token: "UXC",
    type: "Bungalo",
    amount: "$250.00",
    timestamp: "10923",
  },
  {
    token: "UXC",
    type: "Bungalo",
    amount: "$250.00",
    timestamp: "10923",
  },
  {
    token: "UXC",
    type: "Bungalo",
    amount: "$250.00",
    timestamp: "10923",
  },
  {
    token: "UXC",
    type: "Bungalo",
    amount: "$250.00",
    timestamp: "10923",
  },
  {
    token: "UXC",
    type: "Bungalo",
    amount: "$250.00",
    timestamp: "10923",
  },
];

export default function Transactions() {
  return (
    <div className="flex-1">
      <MaxWrapper className="py-4">
        <Table className="w-full max-w-screen-lg mx-auto">
          {/* <TableCaption>A list of your recent transactions.</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Token</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.token}>
                <TableCell className="font-medium">{tx.token}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.timestamp}</TableCell>
                <TableCell className="text-right">{tx.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </MaxWrapper>
    </div>
  );
}
