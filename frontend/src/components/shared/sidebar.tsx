"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";

import { RiSearch2Line } from "react-icons/ri";
import { MdAddHomeWork, MdOutlineAddHomeWork } from "react-icons/md";
import { MdOutlineRealEstateAgent, MdRealEstateAgent } from "react-icons/md";
import { PiSealQuestionLight, PiSealQuestionFill } from "react-icons/pi";

import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";

import { AiOutlineLogout } from "react-icons/ai";

import { IoPieChartOutline, IoPieChart } from "react-icons/io5";
import { logoutUser } from "@/auth";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-clip-border p-3 sticky top-0 left-0">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 my-3.5 px-2 w-max">
        <Image
          src="/logo.svg"
          width={32}
          height={32}
          alt="brand"
          className="w-8 h-8"
        />
        <h5 className="block text-xl antialiased font-bold leading-snug tracking-normal">
          COiTION
        </h5>
      </Link>

      <div className="p-2">
        <div className="relative h-11 w-full min-w-[200px]">
          <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center">
            <RiSearch2Line className="w-5 h-5" />
          </div>
          <Input className="pr-10 h-full" placeholder="Search" />
        </div>
      </div>

      <nav className="flex min-w-[240px] flex-col flex-1 gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <div className="relative block w-full">
          <p className="block mr-auto font-sans text-sm p-2 antialiased font-semibold tracking-widest">
            DASHBOARD
          </p>

          <div className="overflow-hidden">
            <div className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal pl-4">
              <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/10",
                    {
                      "bg-secondary/30 hover:bg-secondary/40 text-foreground":
                        pathname === "/dashboard",
                    }
                  )}>
                  <span className="grid mr-4 place-items-center">
                    {pathname === "/dashboard" ? (
                      <MdRealEstateAgent className="w-5 h-5" />
                    ) : (
                      <MdOutlineRealEstateAgent className="w-5 h-5" />
                    )}
                  </span>
                  Estates
                </Link>
                <Link
                  href="/tradings"
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/10",
                    {
                      "bg-secondary/30 hover:bg-secondary/40 text-foreground":
                        pathname === "/tradings",
                    }
                  )}>
                  <span className="grid mr-4 place-items-center">
                    {pathname === "/tradings" ? (
                      <IoPieChart className="w-5 h-5" />
                    ) : (
                      <IoPieChartOutline className="w-5 h-5" />
                    )}
                  </span>
                  Tradings
                </Link>
                <Link
                  href="/create-listing"
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/10",
                    {
                      "bg-secondary/30 hover:bg-secondary/40 text-foreground":
                        pathname === "/create-listing",
                    }
                  )}>
                  <span className="grid mr-4 place-items-center">
                    {pathname === "/create-listing" ? (
                      <MdAddHomeWork className="w-5 h-5" />
                    ) : (
                      <MdOutlineAddHomeWork className="w-5 h-5" />
                    )}
                  </span>
                  Create Listing
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="relative block w-full">
          <p className="block mr-auto font-sans text-sm p-2 antialiased font-semibold tracking-widest">
            SETTINGS
          </p>

          <div className="overflow-hidden">
            <div className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal pl-4">
              <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal">
                <Link
                  href="/support"
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/10",
                    {
                      "bg-secondary/30 hover:bg-secondary/40 text-foreground":
                        pathname === "/support",
                    }
                  )}>
                  <span className="grid mr-4 place-items-center">
                    {pathname === "/support" ? (
                      <PiSealQuestionFill className="w-5 h-5" />
                    ) : (
                      <PiSealQuestionLight className="w-5 h-5" />
                    )}
                  </span>
                  Help & Support
                </Link>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/10",
                    {
                      "bg-secondary/30 hover:bg-secondary/40 text-foreground":
                        pathname === "/settings",
                    }
                  )}>
                  <span className="grid mr-4 place-items-center">
                    {pathname === "/settings" ? (
                      <IoSettingsSharp className="w-5 h-5" />
                    ) : (
                      <IoSettingsOutline className="w-5 h-5" />
                    )}
                  </span>
                  Settings
                </Link>
                <Link
                  href="/account"
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/10",
                    {
                      "bg-secondary/30 hover:bg-secondary/40 text-foreground":
                        pathname === "/account",
                    }
                  )}>
                  <span className="grid mr-4 place-items-center">
                    {pathname === "/account" ? (
                      <FaUserCircle className="w-5 h-5" />
                    ) : (
                      <FaRegUserCircle className="w-5 h-5" />
                    )}
                  </span>
                  Account
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div
          role="button"
          onClick={() => {
            router.push("/login");
            logoutUser();
          }}
          className="mt-auto flex items-center w-full p-3 h-12 leading-tight transition-all rounded-lg text-[#f96565] outline-none text-start hover:bg-destructive/10">
          <span className="grid mr-4 place-items-center">
            <AiOutlineLogout className="w-5 h-5" />
          </span>
          Logout
        </div>
      </nav>
    </div>
  );
}
