import Image from "next/image";
import Link from "next/link";
import { amountFormatter, formatDate, shortenAddress } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function ListingCard({
  details,
  id,
  createdAt,
}: SingleListingType) {
  return (
    <Link
      href={`/listing/${id}`}
      className="bg-secondary/30 hover:bg-secondary/50 w-full rounded-xl overflow-hidden transition">
      <div className="w-full aspect-[1.5] bg-card group overflow-hidden">
        <Image
          src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${details?.images[0]}`}
          alt={details?.description}
          width={700}
          height={700}
          quality={100}
          priority
          className="w-full h-full object-cover group-hover:scale-125 transition-all duration-300"
        />
      </div>

      <div className="py-4 px-5">
        <h1 className="text-sm md:text-base font-bold">
          Charming Suburban Cottage
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
          {details?.description}
        </p>

        <div className="flex items-center gap-2 text-muted-foreground py-4 border-b">
          <Clock className="w-4 h-4" />
          <p className="text-xs md:text-sm font-medium">
            {formatDate(createdAt)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 pb-1">
          <p className="text-base md:text-lg font-bold">
            ${amountFormatter(Number(details?.price))}
          </p>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            {shortenAddress(`${details?.owner}`)}
          </p>
        </div>
      </div>
    </Link>
  );
}
