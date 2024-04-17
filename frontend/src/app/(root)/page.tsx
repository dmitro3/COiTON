"use client";

import MaxWrapper from "@/components/shared/wrapper";
import { site } from "@/constants";
import Image from "next/image";

export default function RootPage() {
  return (
    <div className="flex-1">
      <MaxWrapper className="py-4">
        <div className="w-full aspect-[1.5] md:aspect-video rounded-3xl md:rounded-[30px] bg-card relative overflow-hidden border">
          <Image
            src="/banner.avif"
            alt={site.title}
            width={2970}
            height={1980}
            priority
            quality={100}
            className="w-full h-full object-cover rounded-3xl md:rounded-[30px] absolute top-0 inset-x-0"
          />

          <div className="w-full h-full gradiant relative flex flex-col justify-end p-4 md:p-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
              {site.name}
            </h1>
            <p className="text-base md:text-xl font-semibold mt-2 max-w-4xl w-full">
              Transforming Urban Investment: Empowering Users Through
              Decentralized Real Estate Trading and Tokenization on the
              UrbanXchange Platform
            </p>
          </div>
        </div>
      </MaxWrapper>
    </div>
  );
}
