"use client";

import Link from "next/link";
import MaxWrapper from "./wrapper";
import { links, site } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";
import { useAuth } from "@/context/authContext";

export default function Header() {
  const { credentials, isFetchingUser } = useAuth();

  const pathname = usePathname();

  return (
    <div className="w-full sticky top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-lg">
      <MaxWrapper className="flex items-center justify-between gap-4 py-6">
        <Link href="/" className="font-bold text-lg md:text-xl tracking-wider">
          {site.name}
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            {links.map(({ href, name }: { href: string; name: string }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm uppercase font-medium tracking-widest text-muted-foreground hover:text-foreground transition",
                  {
                    "text-primary hover:text-primary": href === pathname,
                  }
                )}>
                {name}
              </Link>
            ))}
          </div>

          {isFetchingUser ? (
            <p>Loading...</p>
          ) : credentials ? (
            <Link
              href="/dashboard"
              className={buttonVariants({
                className: "uppercase",
                variant: "secondary",
              })}>
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={buttonVariants({
                  className: "uppercase",
                  variant: "secondary",
                })}>
                Login
              </Link>
              <Link
                href="/register"
                className={buttonVariants({
                  className: "uppercase",
                })}>
                Register
              </Link>
            </div>
          )}
        </div>
      </MaxWrapper>
    </div>
  );
}
