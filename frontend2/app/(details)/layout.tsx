import SidebarMax from "@/components/shared/sidebar-max";
import SidebarMini from "@/components/shared/sidebar-mini";
import React from "react";

export default function DetailsLayout({ children }: ILayout) {
  return (
    <div className="flex-1 flex">
      <SidebarMini />
      <SidebarMax />
      {children}
    </div>
  );
}
