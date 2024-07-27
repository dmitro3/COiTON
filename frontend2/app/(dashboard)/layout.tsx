"use client";

import DashboardHeader from "@/components/shared/dashboard-header";
import SidebarMini from "@/components/shared/sidebar-mini";
import { useAuth } from "@/providers/authprovider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: ILayout) {
  const router = useRouter();

  const { credentials, isFetchingUser } = useAuth();

  useEffect(() => {
    if (!isFetchingUser && !credentials) {
      router.push("/sign-in");
    }
  }, []);

  return (
    <div className="flex-1 flex">
      <div className="hidden md:flex">
        <SidebarMini />
      </div>

      <div className="flex flex-col flex-1">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}
