"use client";

import Link from "next/link";
import React, { useContext } from "react";
import MobileSidebar from "./mobile-sidebar";
import { AuthContext } from "@/context/authentication";
import { shortenAddress } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

export default function DashboardHeader() {
  const { user, isFetchingUser } = useContext(AuthContext);

  return (
    <header className="sticky top-0 left-0 w-full py-2 bg-background">
      <nav className="px-4 w-full h-16 flex items-center justify-between lg:justify-end">
        <MobileSidebar />

        <div className="flex">
          {isFetchingUser ? (
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest pr-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </p>
          ) : (
            <div className="flex items-center text-sm gap-3 lg:pr-2 lg:pl-6 py-2 lg:bg-secondary/30 rounded-full">
              <div className="flex flex-col items-end">
                {shortenAddress(user?.name)}{" "}
                <span className="text-xs text-muted-foreground">
                  {user?.email}
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-secondary"></div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
