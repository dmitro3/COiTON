import { Button, buttonVariants } from "@/components/ui/button";
import { Bath, BedDouble, ExternalLink } from "lucide-react";
import Image from "next/image";
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
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";

const proposals = [
  {
    id: "2651",
    from: "0x000000000000000000000000000000000000000",
    amount: "$250.00",
  },
  {
    id: "8891",
    from: "0x000000000000000000000000000000000000000",
    amount: "$250.00",
  },
  {
    id: "1111",
    from: "0x000000000000000000000000000000000000000",
    amount: "$250.00",
  },
];
export default function EstatePage() {
  return (
    <div className="flex-1 py-6 flex flex-col gap-4">
      <div className="w-full aspect-[1.7] lg:aspect-[2.5] bg-background rounded-2xl overflow-hidden">
        <Image
          src="/banner.avif"
          alt="/"
          className="w-full h-full object-cover rounded-2xl"
          width={2970}
          height={1980}
          priority
          quality={100}
        />
      </div>

      <div className="w-full bg-background rounded-2xl p-6">
        <h1 className="text-xl md:text-2xl font-bold">
          The Ridge Of St. Joseph Apartments
        </h1>
        <p className="text-base font-medium">3599 Huntz Lane View</p>
        <h1 className="text-xl font-bold text-primary">$1,200</h1>

        <div className="flex md:items-center flex-col md:flex-row justify-between mt-4 gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <BedDouble className="w-4 h-4" />
              </div>
              <p className="text-base font-bold">2 Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bath className="w-4 h-4" />
              </div>
              <p className="text-base font-bold">2 Bath</p>
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row gap-4">
            <Link
              href="/dashboard/create-proposal/1"
              className={buttonVariants({
                className: "rounded-full w-full md:w-max",
                variant: "secondary",
              })}>
              Create Proposal
            </Link>
            <Link
              href="/dashboard/market"
              className={buttonVariants({
                className: "rounded-full w-full md:w-max",
              })}>
              View Market
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full bg-background rounded-2xl p-6">
        <p className="text-base md:text-lg font-semibold">Description</p>
        <p className="text-sm md:text-base mt-2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum
          perspiciatis provident velit quibusdam impedit distinctio ipsum,
          molestiae nam odit optio. Autem maxime minima numquam minus, dolores
          nisi, facilis dolorem in ab maiores modi labore accusamus corrupti
          quisquam necessitatibus eius sunt cum earum pariatur eaque atque
          ipsum. Molestiae ipsum eos commodi, illo tempora in cum unde corrupti
          cumque sapiente aut nisi eaque et itaque, voluptatum consequuntur
          debitis iure esse iste aliquam autem quia maxime vero deleniti! Cumque
          aut quia quo. Rem sed alias nulla debitis expedita vero voluptatem
          laborum dolor accusamus facilis saepe nisi deserunt blanditiis porro
          nemo accusantium, officiis incidunt.
        </p>
      </div>

      <div className="w-full bg-background rounded-2xl p-6">
        <p className="text-base md:text-lg font-semibold">Proposals</p>

        <Table className="mt-2">
          <TableCaption>A list of your estate proposals.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">#ID</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">{proposal.id}</TableCell>
                <TableCell>{shortenAddress(proposal.from)}</TableCell>
                <TableCell>{proposal.amount}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`${proposal.id}`}
                    className={buttonVariants({
                      className: "rounded-full hidden sm:flex",
                    })}>
                    View
                  </Link>
                  <Link
                    href={`${proposal.id}`}
                    className={buttonVariants({
                      className: "rounded-full flex sm:hidden",
                      size: "icon",
                    })}>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
