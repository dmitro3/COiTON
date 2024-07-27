"use client";

import ListCard from "@/components/shared/list-card";
import Wrapper from "@/components/shared/wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/useFetch";
import { dummyProperties } from "@/lib/constants";
import { getAllListings } from "@/services/diamondService";
import { useEffect } from "react";

export default function DashboardPage() {
  const {
    fn: getAllListingsFn,
    data: listings,
    isLoading,
  } = useFetch(getAllListings);

  useEffect(() => {
    getAllListingsFn();
  }, []);

  if (!isLoading) {
    console.log(listings);
  }

  return (
    <div className="flex-1">
      <Wrapper className="my-6 xl:my-6 px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 12 }).map((_, _key) => (
                <Skeleton
                  key={_key}
                  className="aspect-[1] w-full backdrop-blur-2xl rounded-2xl"
                />
              ))
            : listings &&
              listings?.map((property: any) => (
                <ListCard {...property} key={property.propertyId} />
              ))}
        </div>
      </Wrapper>
    </div>
  );
}
