"use client";

import DashboardHeader from "@/components/shared/dashboard-header";
import SidebarMini from "@/components/shared/sidebar-mini";

export default function DashboardLayout({ children }: ILayout) {
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
