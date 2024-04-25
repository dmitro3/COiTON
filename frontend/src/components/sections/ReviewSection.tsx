"use client";

import MaxWrapper from "../shared/wrapper";
import Heading from "../shared/heading";
import Slider from "react-slick";
import Image from "next/image";
import { Flame, Star } from "lucide-react";
import { sliderSettings } from "@/constants";
import { shortenAddress } from "@/lib/utils";

export default function ReviewSection() {
  const settings = sliderSettings({ sts1: 2, sts2: 1 });

  return (
    <div className="py-20 flex flex-col gap-6 md:gap-12">
      <MaxWrapper>
        <Heading
          title="What our users say about us"
          subtitle="See our reviews"
        />
      </MaxWrapper>

      <Slider {...settings} className="flex gap-5 px-4 lg:px-10 mx-auto w-full">
        {Array.from({ length: 4 }).map((_, _key) => (
          <div key={_key} className="flex flex-col px-0 sm:px-2">
            <div className="w-full aspect-[1.4] sm:aspect-[1.8] bg-secondary rounded-3xl"></div>

            <div className="mx-auto w-[calc(100%-32px)] max-w-[600px] bg-background rounded-2xl h-auto md:h-[250px] -mt-20 md:-mt-32 mb-4 shadow-sm p-4 md:p-6 flex flex-col">
              <h1 className="text-lg md:text-xl text-primary font-semibold mb-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </h1>
              <p className="text-sm md:text-base leading-6 font-medium">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi
                nulla aliquid dolorum rerum ratione. Qui at eaque explicabo
                necessitatibus et odit quia quam. Necessitatibus autem minus
                libero totam, fugit rem?
              </p>

              <div className="mt-10 md:mt-auto flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary"></div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-bold">John Doe</h2>
                    <p className="text-sm font-normal">
                      {shortenAddress(
                        "0x00000000000000000000000000000000000000"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <p>4.5</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
