"use client";

import { useAuth } from "@/providers/authprovider";
import Wrapper from "./wrapper";
import Image from "next/image";
import { truncate } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { HiOutlineCalendar } from "react-icons/hi2";
import { RiNotification3Line } from "react-icons/ri";
import { RiSearch2Line } from "react-icons/ri";
import { Input } from "../ui/input";
import { RiMenuFoldLine } from "react-icons/ri";

export default function DashboardHeader() {
  const { getCurrentUserFn, isFetchingUser, credentials } = useAuth();

  return (
    <header className="bg-background/80 backdrop-blur-2xl sticky top-0 left-0 w-full border-b h-16 z-50">
      <Wrapper className="flex items-center size-full px-4 md:px-8">
        <div className="flex items-center h-9">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center border size-9 bg-secondary rounded-full overflow-hidden">
              <Image
                src={`data:image/svg+xml;utf8,${encodeURIComponent(
                  credentials?.avatar
                )}`}
                alt={credentials?.name || ""}
                width={32}
                height={32}
                priority
                quality={100}
                className="size-[calc(100%-10%)] object-contain"
              />
            </div>

            <div className="flex flex-col flex-1">
              <p className="text-sm font-medium truncate flex-1">
                {credentials?.name || truncate(`${credentials?.address}`)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {truncate(`${credentials?.address}`)}
              </p>
            </div>
          </div>

          <Separator className="h-[calc(100%-20%)] w-px bg-muted mx-4 hidden md:flex" />

          <Button
            size={"sm"}
            variant={"secondary"}
            className="rounded-full hidden md:flex">
            <HiOutlineCalendar className="mr-2 size-4" /> 23 Jul
          </Button>
        </div>

        <div className="flex items-center justify-end h-9 flex-1">
          <Button size={"icon"} variant={"secondary"} className="rounded-full">
            <RiNotification3Line className="size-4" />
          </Button>

          <Separator className="h-[calc(100%-20%)] w-px bg-muted mx-3 flex md:hidden" />

          <Button
            size={"icon"}
            variant={"outline"}
            className="rounded-full flex md:hidden">
            <RiMenuFoldLine className="size-4" />
          </Button>

          <Separator className="h-[calc(100%-20%)] w-px bg-muted mx-4 hidden md:flex" />

          <w3m-button />
        </div>
      </Wrapper>
    </header>
  );
}
