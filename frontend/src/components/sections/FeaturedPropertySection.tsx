"use client";

import MaxWrapper from "../shared/wrapper";
import { Flame } from "lucide-react";
import Slider from "react-slick";
import Image from "next/image";
import Heading from "../shared/heading";
import { sliderSettings } from "@/constants";

export default function FeaturedPropertySection() {
  const settings = sliderSettings({ sts1: 3, sts2: 2 });

  return (
    <div className="flex-1 py-20">
      <MaxWrapper className="flex flex-col gap-6 md:gap-12">
        <Heading subtitle="Our Recommendations" title="Featured Property" />

        <Slider {...settings} className="flex gap-5">
          {Array.from({ length: 10 }).map((_, _key) => (
            <div key={_key} className="flex flex-col pr-0 sm:pr-5">
              <div className="rounded-[30px] bg-secondary w-full aspect-square overflow-hidden relative">
                <Image
                  src="/banner.avif"
                  alt=""
                  priority
                  quality={100}
                  width={2970}
                  height={1980}
                  className="w-full h-full rounded-[30px] object-cover"
                />

                <div className="absolute bottom-3 left-3 rounded-full bg-red-200 py-1.5 px-4 flex items-center gap-2">
                  <Flame className="w-5 h-5" />
                  Popular
                </div>
              </div>
              <h1 className="text-base md:text-xl font-bold mt-2">
                Property Name
              </h1>
              <p className="mb-4 text-base md:text-lg font-bold">$30,000</p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary"></div>
                <div className="flex flex-col">
                  <h2 className="text-base font-semibold -mb-1">John Doe</h2>
                  <p className="text-sm">Manchester, Kentucky</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </MaxWrapper>
    </div>
  );
}
