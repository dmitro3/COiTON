"use client";

import ListingCard from "@/components/card/ListingCard";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchListings } from "@/hooks/useFetchBackend";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { isLoading, listings } = useFetchListings(true);

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
        {isLoading ? (
          Array.from({ length: 8 }).map((_, _key) => (
            <Skeleton key={_key} className="w-full rounded-xl h-[416px]" />
          ))
        ) : !listings || listings.length === 0 ? (
          <Link
            href="/create-listing"
            className="bg-secondary/30 hover:bg-secondary/40 w-full rounded-xl h-auto aspect-[1] sm:aspect-auto sm:h-[416px] transition flex items-center justify-center flex-col">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center">
              <PlusIcon className="w-10 h-10" />
            </div>
            <p className="mt-2 text-sm md:text-base">Add Property</p>
          </Link>
        ) : (
          listings?.map((listing: any) => {
            const lt = {
              id: listing[0],
              owner: listing[1],
              region: listing[2],
              postalCode: Number(listing[3]),
              description: listing[4],
              price: Number(listing[5]),
              images: listing[6],
              tokenId: listing[7],
              coverImage: listing[8],
              createdAt: Number(listing[9]),
            };
            return <ListingCard key={lt.id} listing={lt} />;
          })
        )}
      </div>
    </div>
  );
}
