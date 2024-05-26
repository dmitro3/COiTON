"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import ListingCard from "@/components/shared/listing-card";
import { useFetchListings } from "@/hooks/contract";
import MaxWrapper from "@/components/shared/max-wrapper";

export default function DashboardPage() {
  const { isLoading, listings } = useFetchListings(true);

  return (
    <div className="mb-4 md:mb-6">
      <MaxWrapper className="px-0 lg:px-0 xl:px-0 2xl:px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, _key) => (
            <Skeleton key={_key} className="w-full rounded-xl h-[363px]" />
          ))
        ) : !listings || listings?.length === 0 ? (
          <Link
            href="/new"
            className="bg-secondary/20 hover:bg-secondary/30 w-full rounded-xl h-auto aspect-[1] sm:aspect-auto sm:h-[363px] transition flex items-center justify-center flex-col">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center">
              <PlusIcon className="w-8 h-8" />
            </div>
            <p className="mt-2 text-sm md:text-base">Create a new listing</p>
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
      </MaxWrapper>
    </div>
  );
}
