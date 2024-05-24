"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import ListingCard from "@/components/shared/listing-card";
import { useFetchListings } from "@/hooks";

export default function DashboardPage() {
  const { isLoading, listings } = useFetchListings(true);

  return (
    <div className="mb-4 md:mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {isLoading ? (
        Array.from({ length: 8 }).map((_, _key) => (
          <Skeleton key={_key} className="w-full rounded-xl h-[363px]" />
        ))
      ) : !listings || listings?.length === 0 ? (
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
          return <ListingCard key={listing.id} listing={listing} />;
        })
      )}
    </div>
  );
}
