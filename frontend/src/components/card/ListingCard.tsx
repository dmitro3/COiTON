import Image from "next/image";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { IoIosExpand } from "react-icons/io";
import Link from "next/link";
import { formatDate, shortenAddress } from "@/lib/utils";
import { Clock, MapPinned } from "lucide-react";

export default function ListingCard({
  details,
  id,
  createdAt,
  updatedAt,
}: SingleListingType) {
  const {
    owner,
    address,
    city,
    country,
    state,
    postalCode,
    description,
    price,
    images: nfts,
  }: ListingType = details;

  /**
   *   {
    details: {
      owner: "0x42AcD393442A1021f01C796A23901F3852e89Ff3",
      address: "Ikorodu",
      city: "lagos",
      country: "Nigeria",
      state: "lagos",
      postalCode: 123123,
      description: "1 sqr meter land with 4 buildings",
      price: 50000,
      images: ["/img/banner.avif", "sdfasdf"],
    },
    id: "32596465-8470-4168-873a-28d7ee44fa6d",
    createdAt: "2024-04-20T21:28:39.842Z",
    updatedAt: "2024-04-20T21:28:39.842Z",
  },
   */
  return (
    <Link
      href={`/property/${id}`}
      className="bg-secondary/30 hover:bg-secondary/50 w-full rounded-xl overflow-hidden transition z-20">
      <div className="w-full aspect-[1.5] bg-card group overflow-hidden">
        <Image
          src={nfts[0]}
          alt={description}
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
          {description}
        </p>

        <div className="flex items-center gap-2 text-muted-foreground py-4 border-b">
          <Clock className="w-4 h-4" />
          <p className="text-xs md:text-sm font-medium">
            {formatDate(createdAt)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 pb-1">
          <p className="text-base md:text-lg font-bold">${price}</p>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            {shortenAddress(`${owner}`)}
          </p>
        </div>
      </div>
    </Link>
  );
}
