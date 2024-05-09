import Image from "next/image";
import Link from "next/link";
import { amountFormatter, formatDate, shortenAddress } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function ListingCard({ listing }: { listing: any }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="bg-secondary/30 hover:bg-secondary/50 w-full rounded-xl overflow-hidden transition">
      <div className="w-full aspect-[1.4] md:aspect-[1.5] bg-card group overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${listing.coverImage}`}
          alt={listing.owner}
          width={700}
          height={700}
          quality={100}
          priority
          className="w-full h-full object-cover group-hover:scale-125 transition-all duration-300"
        />
      </div>

      <div className="py-4 px-5 h-max">
        <h1 className="text-sm md:text-base font-bold">
          Charming Suburban Cottage
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
          {listing.description}
        </p>

        <div className="flex items-center gap-2 text-muted-foreground py-4 border-b">
          <Clock className="w-4 h-4" />
          <p className="text-xs md:text-sm font-medium">
            {formatDate(listing.createdAt)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 pb-1">
          <p className="text-base md:text-lg font-bold">
            ${listing?.price?.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            {shortenAddress(`${listing.owner}`)}
          </p>
        </div>
      </div>
    </Link>
  );
}
