import React from "react";
import { Button } from "../ui/button";

import { TbListDetails } from "react-icons/tb";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { IoImageOutline, IoWalletOutline } from "react-icons/io5";
import { RxClock } from "react-icons/rx";
import { TbCoin } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import { PiFilePdfDuotone } from "react-icons/pi";
import { AiOutlineVideoCamera } from "react-icons/ai";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { formatDate, truncate } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export default function Overview({
  property,
  isLoading,
}: {
  property: any;
  isLoading: boolean;
}) {
  return (
    <div className="size-full bg-background/80 backdrop-blur-2xl flex flex-col">
      <div className="h-14 px-5 flex items-center justify-between border-b">
        <h3 className="text-base font-medium">Details</h3>

        <TbListDetails size={22} />
      </div>

      {isLoading ? (
        <>
          <div className="border-b p-5 flex flex-col gap-6 text-sm">
            <Skeleton className="h-3 w-16 rounded-sm" />

            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                  <Skeleton className="size-3 rounded-sm" />
                  <Skeleton className="h-3 w-16 rounded-sm" />
                </div>
              </div>
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                  <Skeleton className="size-3 rounded-sm" />
                  <Skeleton className="h-3 flex-1 rounded-sm" />
                </div>
              </div>
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                  <Skeleton className="size-3 rounded-sm" />
                  <Skeleton className="h-3 w-16 rounded-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b p-5 flex flex-col gap-6 text-sm">
            <Skeleton className="h-3 w-24 rounded-sm" />

            <div className="flex flex-col gap-4">
              <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                <Skeleton className="size-3 rounded-sm" />
                <Skeleton className="h-3 w-32 rounded-sm" />
              </div>
              <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                <Skeleton className="size-3 rounded-sm" />
                <Skeleton className="h-3 w-36 rounded-sm" />
              </div>
              <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                <Skeleton className="size-3 rounded-sm" />
                <Skeleton className="h-3 w-28 rounded-sm" />
              </div>
            </div>
          </div>

          <div className="border-b p-5 flex flex-col gap-6 text-sm">
            <Skeleton className="h-3 w-28 rounded-sm" />

            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                  <Skeleton className="size-3 rounded-sm" />
                  <Skeleton className="h-3 w-16 rounded-sm" />
                </div>
              </div>
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <div className="flex-1 flex items-center gap-3 max-w-[220px]">
                  <Skeleton className="size-3 rounded-sm" />
                  <Skeleton className="h-3 w-16 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="border-b p-5 flex flex-col gap-6 text-sm">
            <p className="font-bold">Overview</p>

            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground font-medium">Type</p>
                <div className="flex-1 flex items-start max-w-[220px]">
                  <PiBuildingOfficeLight
                    size={18}
                    className="mr-2 text-muted-foreground"
                  />
                  <p className="font-normal flex-1 flex flex-col gap-1">
                    {property?.propertyType || "Property type"}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground font-medium">Location</p>
                <div className="flex-1 flex items-start max-w-[220px]">
                  <LiaMapMarkedAltSolid
                    size={18}
                    className="mr-2 mt-px text-muted-foreground"
                  />
                  <p className="font-normal flex-1 flex flex-col gap-1">
                    <span>{property?.address}</span>
                    {/* <span className="underline text-muted-foreground font-normal cursor-pointer">
                  Open in Google Maps
                </span> */}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground font-medium">Created At</p>
                <div className="flex-1 flex items-start max-w-[220px]">
                  <RxClock
                    size={18}
                    className="mr-2 mt-px text-muted-foreground"
                  />
                  <p className="font-normal flex-1 flex flex-col gap-1">
                    {formatDate(property?.timestamp).formattedDateWithTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b p-5 flex flex-col gap-6 text-sm">
            <p className="font-bold">Attachments</p>

            <div className="flex flex-col gap-4">
              <div className="flex-1 flex items-start max-w-[220px]">
                <PiFilePdfDuotone
                  size={16}
                  className="mr-2 mt-px text-muted-foreground"
                />
                <p className="font-normal flex-1 flex flex-col gap-1 cursor-not-allowed opacity-50">
                  basic_information.pdf
                </p>
              </div>
              <div className="flex-1 flex items-start max-w-[220px]">
                <AiOutlineVideoCamera
                  size={16}
                  className="mr-2 mt-px text-muted-foreground"
                />
                <p className="font-normal flex-1 flex flex-col gap-1 cursor-not-allowed opacity-50">
                  showcase_video.mp4
                </p>
              </div>
              <div className="flex-1 flex items-start max-w-[220px]">
                <IoImageOutline
                  size={16}
                  className="mr-2 mt-px text-muted-foreground"
                />
                <p className="font-normal flex-1 flex flex-col gap-1 cursor-not-allowed opacity-50">
                  showcase_image-1.png
                </p>
              </div>
            </div>
          </div>

          <div className="border-b p-5 flex flex-col gap-6 text-sm">
            <p className="font-bold">Owner</p>

            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground font-medium">Address</p>
                <div className="flex-1 flex items-start max-w-[220px]">
                  <IoWalletOutline
                    size={18}
                    className="mr-2 mt-px text-muted-foreground"
                  />
                  <p className="font-normal flex-1 flex flex-col gap-1 hover:underline cursor-pointer">
                    {truncate(property?.owner)}
                  </p>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground font-medium">
                  Asking price
                </p>
                <div className="flex-1 flex items-start max-w-[220px]">
                  <TbCoin
                    size={18}
                    className="mr-2 mt-px text-muted-foreground"
                  />
                  <p className="font-normal flex-1 flex flex-col gap-1">
                    ${property?.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <iframe
            src={`https://www.google.com/maps?&hl=es;z=14&output=embed`}
            className="w-full aspect-video border mt-auto"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </>
      )}
    </div>
  );
}
