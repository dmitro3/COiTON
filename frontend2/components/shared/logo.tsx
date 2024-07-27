import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import { logoSans } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className={cn(
        "w-max text-lg font-bold tracking-widest font-logo flex items-center",
        logoSans.variable
      )}>
      <Image
        src={siteConfig.icon}
        alt={siteConfig.title}
        width={24}
        height={24}
        priority
        quality={100}
        className="mr-2"
      />
      {siteConfig.title}
    </Link>
  );
}
