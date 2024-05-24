import Link from "next/link";
import Image from "next/image";
import { site } from "@/constants";

export default function Logo({ path }: { path?: string }) {
  return (
    <Link
      href={path ? path : "/"}
      className="flex items-center gap-3 my-3.5 px-2 w-max">
      <div className="w-7 h-8">
        <Image
          src="/img/logo.png"
          alt="logo"
          width={512}
          height={512}
          priority
          className="w-full h-full object-cover"
        />
      </div>
      <h5 className="block text-base md:text-lg antialiased font-bold leading-snug tracking-normal">
        {site.name}
      </h5>
    </Link>
  );
}
