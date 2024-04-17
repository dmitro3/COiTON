"use client";

import MaxWrapper from "@/components/shared/wrapper";
import { site } from "@/constants";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useFetchNews } from "@/hooks/useFetchNews";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsPage() {
  const { isLoading, isError, allNews } = useFetchNews();

  return (
    <div className="flex-1">
      <MaxWrapper className="py-4">
        <div className="w-full aspect-[2.5] rounded-3xl md:rounded-[30px] bg-card relative overflow-hidden border"></div>
        <div className="my-10 space-y-5">
          <h1 className="text-xl md:text-2xl font-semibold">Trending News</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="rounded-[30px] bg-card aspect-[1.3] w-full "
                  />
                ))
              : allNews.map((_, i) => (
                  <div key={i} className="w-full group">
                    <div className="rounded-[30px] bg-card aspect-[1.3] w-full overflow-hidden">
                      <Image
                        src="/banner.avif"
                        alt={site.title}
                        width={2970}
                        height={1980}
                        priority
                        quality={100}
                        className="w-full h-full object-cover rounded-[30px] group-hover:scale-110 transition-all"
                      />
                    </div>
                    <div className="py-3 flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold">Biztoc.com</p>
                        <p>-</p>
                        <p className="text-sm font-medium text-muted-foreground">
                          2024-04-04T14:02:04Z
                        </p>
                      </div>
                      <h1 className="text-xl group-hover:text-blue-400 line-clamp-2 transition-colors">
                        Stock market today: Tech leads market bounce as Powell
                        soothes rate-cut nerves
                      </h1>
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-muted-foreground text-base italic">
                          Author: Barry Ritholtz
                        </p>

                        <p className="text-base font-semibold flex items-center">
                          Visit Site <MoveRight className="w-5 h-5 ml-2" />
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </MaxWrapper>
    </div>
  );
}
