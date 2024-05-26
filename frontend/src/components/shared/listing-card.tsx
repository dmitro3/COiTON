import Image from "next/image";
import Link from "next/link";
import { formatDate, shortenAddress } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function ListingCard({ listing }: { listing: any }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="bg-background border w-full rounded-xl overflow-hidden transition">
      <div className="w-full h-full rounded-xl bg-secondary/20 hover:bg-secondary/30 transition">
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
          <h1 className="text-sm md:text-base font-semibold line-clamp-1">
            {listing?.description.split(";")[0]}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
            {listing.description.split(";")[1]}
          </p>

          <div className="flex items-center gap-1.5 text-muted-foreground py-2 border-b">
            <Clock className="w-4 h-4" />
            <p className="text-xs md:text-sm font-medium">
              {formatDate(Number(listing.createdAt))}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 pb-1">
            <p className="text-xs md:text-sm font-bold">
              ${listing?.price?.toLocaleString()}
            </p>
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              {shortenAddress(`${listing.owner}`)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
