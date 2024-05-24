import Logo from "@/components/shared/logo";
import MaxWrapper from "@/components/shared/max-wrapper";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 inset-x-0 w-full z-50 bg-background h-20 md:h-24 border-b">
      <MaxWrapper className="flex items-center justify-between h-full">
        <Logo />
        <Link
          href="/dashboard"
          className="uppercase text-xs md:text-sm tracking-widest font-medium hover:text-primary">
          Discover more
        </Link>
      </MaxWrapper>
    </header>
  );
}
