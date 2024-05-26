"use client";

import MaxWrapper from "@/components/shared/max-wrapper";
import { useAuth } from "@/context/authContext";
import { cn, shortenAddress } from "@/lib/utils";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const { credentials } = useAuth();
  const { address } = useWeb3ModalAccount();

  return (
    <div className="flex-1 flex flex-col gap-4 w-full">
      <MaxWrapper className="px-0 lg:px-0 xl:px-0 2xl:px-4">
        <div className="rounded-xl md:rounded-3xl w-full aspect-[2.4] md:aspect-[2.9] lg:aspect-[3.9] bg-secondary/50"></div>

        <div className="flex flex-col border-b -mt-14 md:-mt-20 mb-4">
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="w-28 h-28 md:w-32 md:h-32 xl:w-40 xl:h-40 rounded-full bg-secondary border-4 border-background overflow-hidden">
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
                Abdullahi Salihu
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {address}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Link
              href="/profile/assets"
              className={cn(
                "text-xs md:text-sm text-foreground w-full h-10 md:h-12 xl:h-14 hover:bg-secondary/10 transition-colors flex items-center justify-center",
                {
                  "bg-secondary/30 hover:bg-secondary/40":
                    pathname === "/profile/assets",
                }
              )}>
              Assets (20)
            </Link>
            <Link
              href="/profile/balance"
              className={cn(
                "text-xs md:text-sm text-foreground w-full h-10 md:h-12 xl:h-14 hover:bg-secondary/10 transition-colors flex items-center justify-center",
                {
                  "bg-secondary/30 hover:bg-secondary/40":
                    pathname === "/profile/balance",
                }
              )}>
              Balance
            </Link>
          </div>
        </div>

        <main>{children}</main>
      </MaxWrapper>
    </div>
  );
}
