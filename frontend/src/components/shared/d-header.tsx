"use client";

import React, { useContext } from "react";
import MobileSidebar from "./mobile-sidebar";

import { shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/context/authContext";

export default function DashboardHeader() {
  const { isFetchingUser, credentials } = useAuth();

  return (
    <header className="sticky top-0 left-0 w-full py-2 bg-background z-50">
      <nav className="px-4 w-full h-16 flex items-center justify-between lg:justify-end">
        <MobileSidebar />

        <div className="flex">
          {isFetchingUser ? (
            <div className="flex items-center text-sm gap-3">
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="w-20 h-4 rounded-full" />
                <Skeleton className="w-40 h-4 rounded-full" />
              </div>
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center text-sm gap-3">
              <div className="flex flex-col items-end">
                {credentials?.name}{" "}
                <span className="text-xs text-muted-foreground">
                  {shortenAddress(credentials?.address)}
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-secondary">
                <Image
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    credentials?.avatar
                  )}`}
                  alt={credentials?.name || ""}
                  width={40}
                  height={40}
                  priority
                  quality={100}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
