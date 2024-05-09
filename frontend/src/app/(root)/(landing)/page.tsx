"use client";

import ListingCard from "@/components/card/ListingCard";
import TestimonialSection from "@/components/sections/TestimonialSection";

import MaxWrapper from "@/components/shared/wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchListings } from "@/hooks/useFetchBackend";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const { isLoading, listings } = useFetchListings(true);

  return (
    <div className="flex-1">
      <MaxWrapper className="w-full flex relative py-16 md:py-32">
        <div className="max-w-[864px] w-full">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find the perfect home for your lifestyle.
          </h1>
          <p className="max-w-[677px] text-base md:text-lg font-regular mb-4 md:mb-6">
            Creating lasting connections between people and their perfect homes,
            redefined luxury living that seamlessly integrates comfort.
          </p>

          <div className="flex items-center gap-4">
            <Button>Explore Our Homes</Button>
            <Button variant="secondary">Meet An Expert</Button>
          </div>
        </div>

        <Image
          src="/svg/home.svg"
          alt="home"
          width={700}
          height={700}
          quality={100}
          priority
          className="absolute -bottom-0 right-0 select-none pointer-events-none"
        />
      </MaxWrapper>

      <div className="w-full bg-secondary aspect-[1.5] md:aspect-[1.8] lg:aspect-[2.3] group overflow-hidden">
        <Image
          src="/img/banner.jpeg"
          alt="home"
          priority
          width={3840}
          height={2160}
          quality={100}
          className="w-full h-full object-cover group-hover:scale-150 transition-all duration-1000 hover:brightness-100 brightness-50"
        />
      </div>

      <MaxWrapper className="pt-32 flex w-full gap-6 md:gap-10 justify-between items-center flex-col lg:flex-row">
        <div className="w-full lg:w-[550px] aspect-[1.2] bg-secondary rounded-2xl"></div>

        <div className="w-full max-w-[650px]">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Experience luxury and comfort in every detail of new life.
          </h1>

          <div className="flex flex-col gap-3 mb-6">
            <p className="text-sm md:text-base font-regular">
              Creating lasting connections between people and their perfect
              homes, redefined luxury living that seamlessly integrates comfort,
              helping you find not just a house but a place to truly belong.
            </p>
            <p className="text-sm md:text-base font-regular">
              Redefined luxury living that seamlessly integrates comfort,
              helping you find not just a house but a place to truly belong.
            </p>
          </div>

          <Button variant="secondary">Read Our Story</Button>
        </div>
      </MaxWrapper>

      <MaxWrapper className="pt-32 flex w-full gap-10 flex-col">
        <div className="flex items-center justify-between w-full  mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Discover latest listing
          </h1>

          <Link
            href="/listings"
            className={buttonVariants({
              variant: "secondary",
            })}>
            See All Listing
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, _key) => (
              <Skeleton key={_key} className="w-full rounded-xl h-[416px]" />
            ))
          ) : !listings ? (
            <p>Nothing to display</p>
          ) : (
            listings?.slice(0, 3)?.map((listing: any) => {
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
      </MaxWrapper>

      <TestimonialSection />
    </div>
  );
}
