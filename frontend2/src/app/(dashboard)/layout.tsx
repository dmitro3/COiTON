"use client";

import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import LoadingComponent from "@/components/shared/loader";
import { useAuthContext } from "@/providers/authcontext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const { getUser, isFetchingUser } = useAuthContext();

  const fetchUser = async () => {
    const { data, error }: any = await getUser();

    if (error || !data?.user) return router.replace("/sign-in");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (isFetchingUser) return <LoadingComponent text="Hold on for a bit..." />;

  return (
    <div className="flex w-full h-full">
      <div className="max-w-[20rem] w-full h-svh hidden sticky top-0 left-0 lg:flex border-r">
        <Sidebar />
      </div>

      <main
        className="flex flex-col w-full flex-1 h-full"
        //  bg-secondary rounded-l-3xl
      >
        <DashboardHeader />

        <div className="flex-1 h-full px-4 py-2">{children}</div>
        <Image
          src="/svg/home.svg"
          alt="home"
          width={800}
          height={800}
          quality={100}
          priority
          className="fixed -bottom-0 right-0 select-none pointer-events-none -z-10"
        />
      </main>
    </div>
  );
}
