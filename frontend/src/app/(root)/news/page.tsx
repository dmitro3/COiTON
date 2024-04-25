/* eslint-disable @next/next/no-img-element */
"use client";

import MaxWrapper from "@/components/shared/wrapper";
import { site } from "@/constants";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useFetchNews } from "@/hooks/useFetchNews";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import NewsCard from "@/components/card/NewsCard";

export default function NewsPage() {
  const { isLoading, isError, allNews } = useFetchNews();

  return (
    <div className="flex-1">
      <MaxWrapper className="py-4">
        <div className="w-full aspect-[2] md:aspect-[2.5] rounded-3xl md:rounded-[30px] bg-card relative overflow-hidden flex items-center justify-center">
          <Image
            src="/news.jpeg"
            alt={site.title}
            width={2970}
            height={1980}
            priority
            quality={100}
            className="w-full h-full object-cover rounded-3xl md:rounded-[30px] absolute top-0 inset-x-0"
          />

          <div className="w-full h-full gradiant relative flex flex-col justify-end p-4 md:p-10">
            <h1 className="text-3xl lg:text-4xl font-black truncate">
              Real estate developers raise concerns over alleged imposters
            </h1>
            <p className="text-base md:text-lg font-semibold mt-0 md:mt-2 max-w-4xl w-full line-clamp-2">
              The leadership of the Real Estate Developers Association of
              Nigeria, Lagos State chapter, has decried a plan to hijack and
              absorb some alleged imposters into the association.
            </p>

            <Link
              href="https://punchng.com/real-estate-developers-raise-concerns-over-alleged-imposters/"
              target="_blank"
              className="text-base font-semibold flex items-center mt-4 md:mt-6 rounded-full w-max">
              Read More <MoveRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
        <div className="my-10 space-y-5">
          <h1 className="text-xl md:text-2xl font-semibold">Trending News</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="rounded-[30px] bg-card aspect-[1.3] w-full"
                  />
                ))
              : allNews?.map((news: any) => (
                  <NewsCard {...news} key={news.publishedAt} />
                ))}
          </div>
        </div>
      </MaxWrapper>
    </div>
  );
}
