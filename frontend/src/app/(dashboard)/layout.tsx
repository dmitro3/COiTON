"use client";

import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import LoadingComponent from "@/components/shared/loader";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { credentials, isFetchingUser } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!isFetchingUser && !credentials) {
  //     router.push("/sign-in");
  //   }
  // }, [credentials, isFetchingUser, router]);

  if (isFetchingUser) {
    return <LoadingComponent text="Fetching credentials..." />;
  }

  return (
    <div className="flex w-full h-full">
      <div className="max-w-[20rem] w-full h-svh hidden sticky top-0 left-0 lg:flex border-r">
        <Sidebar />
      </div>

      <main className="flex flex-col w-full flex-1 h-full">
        <DashboardHeader />

        <div className="flex-1 h-full px-4 pt-2 mb-4 relative">{children}</div>
      </main>
    </div>
  );
}
