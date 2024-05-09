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

/**
5 bedroom Detached Duplex For Sale Bera Estate, Chevron Drive, Chevron Drive Lekki Lagos selling for ₦280,000,000. See property details on PrivateProperty.com.ng or browse all our range of properties in Chevron Drive Lekki Lagos

OFFPLAN/ONGOING
Fully Automated Smart Duplexes

*LOCATIONS: Bera Estate , Chevron Lekki*

*5 Bedroom Fully Detached

TITLE : GOVERNORS CONSENT

*Pls Note:* All our properties are still under construction.

===============

280000000

===============

Bera Estate , Chevron Lekki

===============

Fully Automated Smart Homes
Refrigerator
TV
AC
Washing Machine
Oven
Secured estate
Fully Fitted Kitchen
Water Heaters
Pop Ceiling
24/7 Security / Dedicated Estate Transformer
Children Play Area
Gym / Swimming Pool
Estate Club House / Estate Central Generator/ Power House
Estate Refuse Dump Area
 */
