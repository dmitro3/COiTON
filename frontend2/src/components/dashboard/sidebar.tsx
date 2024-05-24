"use client";

import { side_links, site } from "@/constants";
import { useAuthContext } from "@/providers/authcontext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RiSearch2Line } from "react-icons/ri";
import Logo from "@/components/shared/logo";

export default function Sidebar() {
  const pathname = usePathname();

  const { address } = useAuthContext();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ADMIN_ADDRESS === address) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [address]);

  const toRender = side_links.filter((link) => {
    if (link.isAdmin) {
      return isAdmin;
    } else {
      return true;
    }
  });

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-clip-border p-3 md:p-2 sticky top-0 left-0">
      <Logo path="/dashboard" />

      <div className="p-2">
        <div className="relative h-10 w-full min-w-[200px]">
          <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center">
            <RiSearch2Line className="w-5 h-5 text-muted-foreground" />
          </div>
          <Input className="pr-10 pl-4 h-full" disabled placeholder="Search" />
        </div>
      </div>

      <nav className="flex min-w-[240px] flex-col flex-1 gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div className="w-full h-full flex flex-col gap-1">
          {toRender.map((route) => (
            <Link
              key={route.name}
              href={route.path}
              className={cn(
                "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/50 hover:text-foreground text-sm font-medium group",
                {
                  "bg-primary/5 hover:bg-primary/10 hover:text-primary text-primary font-semibold":
                    route.path === pathname,
                }
              )}>
              <span className="grid mr-3 place-items-center">{route.icon}</span>
              {route.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
