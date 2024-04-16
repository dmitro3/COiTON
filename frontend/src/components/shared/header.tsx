"use client";

import Link from "next/link";
import MaxWrapper from "./wrapper";
import { site } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { AlignJustify, WalletIcon } from "lucide-react";

const links = [
  {
    name: "Trading",
    href: "/trading",
  },
  {
    name: "Tokenization",
    href: "/tokenization",
  },
  {
    name: "Indices",
    href: "/indices",
  },
  {
    name: "Account",
    href: "/city-indices",
  },
  {
    name: "Compliance",
    href: "/compliance",
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="w-full sticky top-0 inset-x-0 z-10 bg-background/60 backdrop-blur-lg">
      <MaxWrapper className="flex items-center justify-between gap-4 py-6">
        <Link href="/" className="font-semibold text-lg tracking-wider">
          {site.name}
        </Link>

        <div className="flex items-center">
          <div className="flex items-center mr-2 md:mr-4 pr-2 md:pr-4 border-r h-7">
            <Button className="flex md:hidden" size="icon" variant="secondary">
              <AlignJustify className="w-5 h-5" />
            </Button>
            <div className="hidden md:flex items-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm uppercase font-semibold tracking-widest text-muted-foreground hover:text-primary transition",
                    {
                      "text-primary": link.href === pathname,
                    }
                  )}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <>
            <Button
              className="text-base rounded-full font-semibold hidden lg:flex"
              variant="secondary">
              Connect Wallet <WalletIcon className="w-4 h-4 ml-2" />
            </Button>
            <Button className="flex lg:hidden" size="icon" variant="secondary">
              <WalletIcon className="w-5 h-5" />
            </Button>
          </>
        </div>
      </MaxWrapper>
    </div>
  );
}
