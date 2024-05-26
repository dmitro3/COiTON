import React from "react";
import MobileSidebar from "./mobile-sidebar";
import { Menu } from "./menu";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 left-0 w-full py-2 bg-background z-50">
      <nav className="px-4 w-full h-16 flex items-center justify-between lg:justify-end">
        <MobileSidebar />

        <Menu />
      </nav>
    </header>
  );
}
