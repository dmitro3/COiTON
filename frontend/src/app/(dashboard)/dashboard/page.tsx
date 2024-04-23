"use client";

import ListingCard from "@/components/card/ListingCard";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<SingleListingType[]>();
  async function fetchListingData() {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://decentralized-real-estate-trading.onrender.com/api/v1/listings",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        toast("Failed to create listing");
        throw new Error("Failed to create listing");
      }
      const result = await response.json();
      setListings(result?.data?.rows);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchListingData();
  }, []);

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
            <Skeleton key={_key} className="w-full rounded-xl h-[380px]" />
          ))
        ) : listings && listings.length === 0 ? (
          <Link
            href="/create-listing"
            className="bg-secondary/10 hover:bg-secondary/20 w-full rounded-xl h-[380px] transition flex items-center justify-center flex-col">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center">
              <PlusIcon className="w-10 h-10" />
            </div>
            <p className="mt-2 text-sm md:text-base">Add Property</p>
          </Link>
        ) : (
          listings?.map((listing: SingleListingType) => (
            <ListingCard key={listing.id} {...listing} />
          ))
        )}
      </div>
    </div>
  );
}
