"use client";

import MaxWrapper from "@/components/shared/max-wrapper";
import { useAuth } from "@/context/authContext";
import { useFetchUserListings } from "@/hooks/contract";
import { cn, shortenAddress } from "@/lib/utils";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import ListingCard from "@/components/shared/listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";

//? CHATGPT GENERATE RANDOM LINEAR GRADIENT FOR THE COVER PHOTO

function hashValue(value: string): number {
  // Hash the user's value to generate a number
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateColorFromHash(
  hash: number,
  baseH: number,
  baseS: number,
  baseL: number
): string {
  // Create variations of the base color
  const hueVariation = (hash % 30) - 15; // Generate a variation between -15 and 15
  const lightnessVariation = ((hash >> 3) % 20) - 10; // Generate a variation between -10 and 10

  const h = (baseH + hueVariation + 360) % 360; // Ensure hue stays within 0-360
  const l = Math.max(0, Math.min(100, baseL + lightnessVariation)); // Ensure lightness stays within 0-100

  return hslToHex(h, baseS, l);
}

function generateGradientFromValue(value: string): string {
  const baseH = 176; // Hue for #019E92
  const baseS = 81; // Saturation for #019E92
  const baseL = 31; // Lightness for #019E92

  const hash1 = hashValue(value);
  const hash2 = hashValue(value.split("").reverse().join(""));

  // Generate two colors based on the hashed values
  const color1 = generateColorFromHash(hash1, baseH, baseS, baseL);
  const color2 = generateColorFromHash(hash2, baseH, baseS, baseL);

  // Return the CSS gradient string
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

//? CHATGPT GENERATE RANDOM LINEAR GRADIENT FOR THE COVER PHOTO

export default function ProfilePage() {
  const pathname = usePathname();

  const { credentials, isFetchingUser } = useAuth();
  const { fetchData, listings, isLoading, userBalance } =
    useFetchUserListings();

  const [coverPhotoBg, setCoverPhotoBg] = useState("");

  useEffect(() => {
    if (!isFetchingUser && credentials) {
      const coverColor = generateGradientFromValue(
        credentials?.address.toString()
      );
      setCoverPhotoBg(coverColor);
      fetchData(credentials?.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials, isFetchingUser, pathname]);

  if (isLoading)
    return (
      <MaxWrapper className="px-0 lg:px-0 xl:px-0 2xl:px-4">
        <Skeleton className="rounded-xl md:rounded-3xl w-full aspect-[1.9] md:aspect-[2.9] lg:aspect-[3.9]" />

        <div className="flex flex-col items-center justify-center -mt-14 md:-mt-20 mb-4 md:mb-6">
          <Skeleton className="w-28 h-28 md:w-32 md:h-32 xl:w-36 xl:h-36 rounded-full bg-secondary border-4 border-background overflow-hidden" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, _key) => (
            <Skeleton key={_key} className="w-full rounded-xl h-[363px]" />
          ))}
        </div>
      </MaxWrapper>
    );

  return (
    <div className="flex-1 flex flex-col gap-4 w-full">
      <MaxWrapper className="px-0 lg:px-0 xl:px-0 2xl:px-4">
        <div
          className="rounded-xl md:rounded-3xl w-full aspect-[1.9] md:aspect-[2.9] lg:aspect-[3.9]"
          style={{
            background: coverPhotoBg ? coverPhotoBg : "bg-secondary/50",
          }}></div>

        <div className="flex flex-col items-center justify-center -mt-14 md:-mt-20 mb-4 md:mb-6">
          <div className="w-28 h-28 md:w-32 md:h-32 xl:w-36 xl:h-36 rounded-full bg-secondary border-4 border-background overflow-hidden">
            <Image
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                credentials?.avatar
              )}`}
              alt={`${credentials?.name} profile picture`}
              width={160}
              height={160}
              className="object-contain object-center rounded-full"
            />
          </div>
          <div className="mt-2 mb-4 text-center">
            <h1 className="text-lg md:text-xl font-semibold">
              {credentials?.name}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              {shortenAddress(credentials?.address)}
            </p>

            <h1 className="text-sm md:text-base">
              Balance:{" "}
              <span className="font-semibold text-primary">
                ${Number(userBalance).toLocaleString()}
              </span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {!listings || listings?.length === 0 ? (
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
        </div>
      </MaxWrapper>
    </div>
  );
}
