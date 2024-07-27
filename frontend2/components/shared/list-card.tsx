import Image from "next/image";
import React from "react";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { RxClock } from "react-icons/rx";
import { TbCoin } from "react-icons/tb";
import { Button } from "../ui/button";
import Link from "next/link";
import { variables } from "@/utils/env";
import { formatDate, truncate } from "@/lib/utils";
import { Clock } from "lucide-react";

export default function ListCard(property: any) {
  return (
    <div className="bg-background/80 backdrop-blur-2xl rounded-2xl border w-full p-3 flex flex-col gap-3 relative group overflow-hidden">
      <div className="bg-secondary border rounded-xl w-full aspect-video p-1">
        <div className="size-full rounded-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 size-full bg-gradient-to-b from-transparent via-background/30 to-background/80 z-10 opacity-0 group-hover:opacity-100 duration-200" />
          <Button
            asChild
            className="absolute bottom-1 scale-75 group-hover:bottom-4 group-hover:scale-100 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 left-1/2 -translate-x-1/2 z-10 rounded-full px-6">
            <Link href={`/listing/${property?.propertyId}`}>View Property</Link>
          </Button>

          <Image
            src={property?.coverImage}
            alt={property?.owner}
            fill
            priority
            className="size-full object-cover group-hover:scale-110 duration-300 delay-200"
          />
        </div>
      </div>

      <div className="p-4 bg-secondary/50 border rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="flex items-center text-xs text-muted-foreground">
            <PiBuildingOfficeLight size={16} className="mr-1.5" />
            {property?.propertyType || "Property Type"}
          </p>
          <p className="text-xs text-primary font-semibold flex items-center">
            <TbCoin size={16} className="mr-1.5" />
            {property?.price.toLocaleString()}
          </p>
        </div>

        <p className="text-sm sm:text-base line-clamp-2 flex-1 font-semibold mb-2">
          {property?.title || "No title"}
        </p>

        <div className="flex items-center gap-4">
          <p className="flex items-center text-xs text-muted-foreground">
            <RxClock size={16} className="mr-1.5" />
            {formatDate(property?.timestamp).formattedDate}
          </p>
          <p className="flex items-center text-xs text-muted-foreground">
            <TbCoin size={16} className="mr-1.5" />
            {truncate(property?.owner)}
          </p>
        </div>

        <p className="flex items-center text-xs text-muted-foreground mt-3 mb-4">
          <LiaMapMarkedAltSolid size={16} className="mr-1.5" />
          <span className="line-clamp-1 flex-1">{property?.address}</span>
        </p>

        <Link className="flex-1" href={`/listing/${property?.propertyId}`}>
          <Button className="rounded-full w-full">Buy Property</Button>
        </Link>
      </div>
    </div>
  );
}
