"use client";

import ListingCard from "@/components/card/ListingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFetchListings } from "@/hooks/useFetchBackend";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default function AssetsPage() {
  const { isLoading, listings } = useFetchListings(true);

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">Assets</h1>

      <div className="flex flex-col w-full">
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="balances">Balance</TabsTrigger>
          </TabsList>
          <div className="mt-4 py-4 border-t w-full">
            <TabsContent value="listings">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, _key) => (
                    <Skeleton
                      key={_key}
                      className="w-full rounded-xl h-[416px]"
                    />
                  ))
                ) : !listings || listings.length === 0 ? (
                  <p className="border border-orange-600 rounded-md py-1.5 px-3.5 w-max bg-orange-500/20 text-sm md:text-base">
                    You have no listings yet
                  </p>
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
            </TabsContent>
            <TabsContent value="balances">
              <div className="flex items-center gap-4">
                <div className="bg-secondary/30 border rounded-lg p-6 w-full max-w-[300px]">
                  <p className="text-base font-medium">Trade Balance</p>
                  <h1 className="text-2xl md:text-3xl font-bold">$300</h1>
                </div>
                <div className="bg-secondary/30 border rounded-lg p-6 w-full max-w-[300px]">
                  <p className="text-base font-medium">Trade Balance</p>
                  <h1 className="text-2xl md:text-3xl font-bold">$300</h1>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
