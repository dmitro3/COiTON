import ListingCard from "@/components/card/ListingCard";
import { buttonVariants } from "@/components/ui/button";
import { listings } from "@/constants";
import Link from "next/link";
import React, { useContext } from "react";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl capitalize font-bold">
          Find your dream home
        </h1>

        <Link
          href="/create-listing"
          className={buttonVariants({ variant: "outline" })}>
          Add Property
        </Link>
      </div>

      <div className="mt-4 py-6 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {listings.map((listing: SingleListingType) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </div>
  );
}
