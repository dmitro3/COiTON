"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "./logo";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/providers/authprovider";
import { Skeleton } from "../ui/skeleton";

const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Buy a Home",
    path: "/buy",
  },
  {
    name: "List property",
    path: "/create",
  },
];

export default function Header() {
  const pathname = usePathname();
  const { credentials, isFetchingUser } = useAuth();

  return (
    <header className="w-full h-16 md:h-20 px-4 md:px-6 lg:px-8 sticky top-0 left-0 z-50 bg-background/80 backdrop-blur-2xl border-b">
      <div className="size-full flex items-center justify-between">
        <div className="flex items-center gap-6 h-full">
          <div className="w-max md:w-36 md:border-r h-full flex items-center">
            <Logo />
          </div>

          <div className="hidden md:flex items-center gap-7">
            {routes.map((route) => (
              <Link
                className={cn(
                  "text-base text-muted-foreground hover:text-primary transition-colors",
                  {
                    "text-primary": route.path === pathname,
                  }
                )}
                key={route.path}
                href={route.path}>
                {route.name}
              </Link>
            ))}
          </div>
        </div>

        {isFetchingUser ? (
          <Skeleton className="rounded-full h-10 w-32" />
        ) : (
          <Button className="rounded-full" asChild>
            <Link
              href={credentials ? "/dashboard" : "/sign-in"}
              className="flex items-center">
              Get started <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
