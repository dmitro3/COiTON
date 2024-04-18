import FeaturedPropertySection from "@/components/sections/FeaturedPropertySection";
import NewsSection from "@/components/sections/NewsSection";
import ReviewSection from "@/components/sections/ReviewSection";
import MaxWrapper2 from "@/components/shared/max-wrapper";
import { site } from "@/constants";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex-1">
      <div className="aspect-[1.4] lg:aspect-[1.7] xl:aspect-[2.3] bg-primary">
        <MaxWrapper2 className="py-4 md:py-7 lg:py-10 h-full">
          <div className="w-full h-full bg-background rounded-3xl flex items-center justify-center flex-col px-4">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-primary text-center">
              Explore the world of real estate
            </h1>
            <p className="text-sm md:text-base lg:text-lg font-medium text-center">
              {site.title}
            </p>
          </div>
        </MaxWrapper2>
      </div>
      <FeaturedPropertySection />
      <ReviewSection />
      <NewsSection />
    </div>
  );
}
