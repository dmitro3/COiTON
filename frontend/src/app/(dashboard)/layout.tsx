"use client";

import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";

import LoadingComponent from "@/components/shared/loader";

import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { isFetchingUser } = useAuth();

  if (isFetchingUser)
    return <LoadingComponent text="Fetching credentials..." />;

  return (
    <div className="flex w-full h-full">
      <div className="max-w-[20rem] w-full h-svh hidden sticky top-0 left-0 lg:flex border-r">
        <Sidebar />
      </div>

      <main className="flex flex-col w-full flex-1 h-full">
        <DashboardHeader />

        <div className="flex-1 h-full px-4 pt-2 mb-4 relative">{children}</div>
        {/* <Image
          src="/svg/home.svg"
          alt="home"
          width={800}
          height={800}
          quality={100}
          priority
          className="fixed -bottom-0 right-0 select-none pointer-events-none"
        /> */}
      </main>
    </div>
  );
}
