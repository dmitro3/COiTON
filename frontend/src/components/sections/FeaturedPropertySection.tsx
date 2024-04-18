import React from "react";
import { Badge } from "../ui/badge";
import { Bath, BedDouble, Expand, MapPinnedIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function FeaturedPropertySection() {
  return (
    <div className="mt-20">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-xl md:text-3xl font-semibold">
          Featured Property For Sale
        </h1>
        <p className="text-lg font-regular max-w-screen-md">
          At vero eos et accusamus et iusto odio dignissimos ducimus qui
          blanditiis praesentium voluptatum deleniti atque corrupti quos dolores
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            className="flex-1 bg-card flex flex-col md:flex-row rounded-2xl overflow-hidden border group"
            key={index}>
            <div className="w-full md:w-[256px] aspect-[1.5] md:aspect-[1.2] bg-secondary/50 overflow-hidden">
              <Image
                src="/banner.avif"
                alt="title"
                width={2970}
                height={1980}
                priority
                quality={100}
                className="w-full h-full object-cover group-hover:scale-110 transition-all"
              />
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex flex-col px-4 py-3">
                <h1 className="font-semibold truncate">
                  The Ridge Of St. Joseph Apartments
                </h1>
                <div className="flex items-end justify-between">
                  <Badge className="w-max mt-1" variant="secondary">
                    Rent
                  </Badge>
                  <h1 className="text-xl font-bold">$30,000</h1>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 px-4 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-secondary rounded-full">
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium truncate">4 Beds</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-secondary rounded-full">
                    <Bath className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium truncate">2 Baths</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 flex items-center justify-center bg-secondary rounded-full">
                    <Expand className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium truncate">1200 sqft</p>
                </div>
              </div>

              <div className="border-t px-4 py-2 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPinnedIcon className="w-4 h-4" />
                  <p className="text-sm font-medium">3599 Huntz Lane</p>
                </div>

                <Button className="rounded-full text-foreground font-bold">
                  View
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
