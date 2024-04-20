"use client";

import { side_links } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex-1 max-w-96 w-full py-3 px-4 bg-primary text-secondary sticky top-0 left-0 hidden lg:flex">
      <div className="flex flex-col h-full gap-4 w-full">
        <Link href="/" className="w-max">
          <Image
            src="/logo.svg"
            alt="logo"
            width={50}
            height={50}
            priority
            quality={100}
          />
        </Link>

        <div className="flex-1 w-full flex flex-col gap-1">
          {side_links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "py-3 px-4 hover:bg-background/5 rounded-md w-full flex items-center gap-4",
                {
                  "bg-background/10 hover:bg-background/20":
                    link.path === pathname,
                }
              )}>
              <link.icon className="w-6 h-6" />
              <p className="text-base font-semibold">{link.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
