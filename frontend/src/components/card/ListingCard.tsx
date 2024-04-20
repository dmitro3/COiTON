import Image from "next/image";
import { LiaBedSolid } from "react-icons/lia";
import { PiBathtub } from "react-icons/pi";
import { IoIosExpand } from "react-icons/io";
import Link from "next/link";

export default function ListingCard() {
  return (
    <Link
      href="/"
      className="bg-secondary/30 hover:bg-secondary/50 w-full rounded-xl overflow-hidden transition">
      <div className="w-full aspect-[1.5] bg-card group overflow-hidden">
        <Image
          src="/img/banner.avif"
          alt="home"
          width={700}
          height={700}
          quality={100}
          priority
          className="w-full h-full object-cover group-hover:scale-125 transition-all duration-300"
        />
      </div>

      <div className="py-4 px-5">
        <h1 className="text-base md:text-lg font-bold">
          Charming Suburban Cottage
        </h1>
        <p className="text-sm text-muted-foreground">
          Sunnybrook Ln. Clearwater, Florida
        </p>

        <div className="py-5 border-b flex items-center gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <LiaBedSolid className="w-5 h-5" />
            <p className="text-sm font-medium">3 BED</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <PiBathtub className="w-5 h-5" />
            <p className="text-sm font-medium">3 BATH</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IoIosExpand className="w-5 h-5" />
            <p className="text-sm font-medium">2400 SQFT</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 pb-2">
          <p className="text-lg md:text-xl font-bold">$13,60,000</p>
          <p className="text-xs font-medium text-muted-foreground">FOR SALE</p>
        </div>
      </div>
    </Link>
  );
}
