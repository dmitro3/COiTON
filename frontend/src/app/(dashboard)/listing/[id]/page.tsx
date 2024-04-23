"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ListingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [listing, setListing] = useState<SingleListingType>();
  async function fetchListingData() {
    try {
      setIsLoading(true);
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
      if (!result?.data?.rows) {
        return router.push("/dashboard");
      }

      // Find the listing with matching ID
      const foundListing = result?.data?.rows.find(
        (item: any) => item.id === params.id
      );
      if (foundListing) {
        setListing(foundListing);
        console.log(foundListing);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        toast("Listing not found");
        return router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchListingData();
  }, []);

  return (
    <div className="flex-1">
      {isLoading ? (
        <Skeleton className="w-full aspect-[2.5] rounded-xl" />
      ) : (
        <div className="w-full aspect-[2.5] bg-secondary rounded-xl overflow-hidden">
          <Image
            src={`https://bronze-gigantic-quokka-778.mypinata.cloud/ipfs/${listing?.details?.images[0]}`}
            alt="anan"
            width={500}
            height={500}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
