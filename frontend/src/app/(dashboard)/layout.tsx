"use client";

import DashboardHeader from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import LoadingComponent from "@/components/shared/loader";
import { site } from "@/constants";
import { useAuth } from "@/context/authContext";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { toast } from "sonner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { address } = useWeb3ModalAccount();
  const router = useRouter();

  const { isFetchingUser, credentials, getUser } = useAuth();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data, error }: any = getUser();
  //     if (!data?.user || error) {
  //       toast.error("Authentication Error", {
  //         description: `Please sign in to continue using ${site.name}.`,
  //       });
  //       router.push("/sign-in");
  //       return;
  //     }
  //   };

  //   fetchUser();
  // }, [address, router, getUser]);

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
