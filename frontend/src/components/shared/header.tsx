"use client";

import Link from "next/link";
import MaxWrapper from "./wrapper";
import { links, site } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { AlignJustify, WalletIcon } from "lucide-react";
import { SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="w-full sticky top-0 inset-x-0 z-20 bg-background border-b">
      <MaxWrapper className="flex items-center justify-between gap-4 py-4 md:py-6">
        <Link href="/" className="font-bold text-lg md:text-xl tracking-wider">
          {site.name}
        </Link>

        <div className="flex items-center">
          <div className="flex items-center mr-2 md:mr-4 pr-2 md:pr-4 border-r h-7">
            <Button className="flex md:hidden" size="icon" variant="secondary">
              <AlignJustify className="w-5 h-5" />
            </Button>
            <div className="hidden md:flex items-center gap-4">
              {links.map(({ href, name }: { href: string; name: string }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-sm uppercase font-semibold tracking-widest text-muted-foreground hover:text-foreground transition",
                    {
                      "text-primary hover:text-primary": href === pathname,
                    }
                  )}>
                  {name}
                </Link>
              ))}
            </div>
          </div>
          <>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button className="text-base rounded-full font-semibold hidden lg:flex">
                  Connect Wallet <WalletIcon className="w-4 h-4 ml-2" />
                </Button>
              </SignUpButton>
              <SignUpButton mode="modal">
                <Button className="flex lg:hidden" size="icon">
                  <WalletIcon className="w-5 h-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
          </>
        </div>
      </MaxWrapper>
    </div>
  );
}
