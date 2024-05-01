"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Input } from "../ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { RiSearch2Line } from "react-icons/ri";
import { MdAddHomeWork, MdOutlineAddHomeWork } from "react-icons/md";
import { MdOutlineSpaceDashboard, MdSpaceDashboard } from "react-icons/md";
import { PiSealQuestionLight, PiSealQuestionFill } from "react-icons/pi";

import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { RiNotification2Line, RiNotification2Fill } from "react-icons/ri";

import { BiSelectMultiple, BiSolidSelectMultiple } from "react-icons/bi";

import { MdReport, MdReportGmailerrorred } from "react-icons/md";

import { AiOutlineLogout } from "react-icons/ai";

import { IoPieChartOutline, IoPieChart } from "react-icons/io5";
import { logoutUser } from "@/auth";
import { useEffect, useState } from "react";
import { useDisconnect, useWeb3ModalAccount } from "@web3modal/ethers/react";

const side_links = [
  {
    part: "DASHBOARD",
    links: [
      {
        name: "All Estate",
        path: "/dashboard",
        active: <MdSpaceDashboard className="w-5 h-5" />,
        inactive: <MdOutlineSpaceDashboard className="w-5 h-5" />,
      },
      {
        name: "Trades",
        path: "/tradings",
        active: <IoPieChart className="w-5 h-5" />,
        inactive: <IoPieChartOutline className="w-5 h-5" />,
      },
      {
        name: "Create Listing",
        path: "/create-listing",
        active: <MdAddHomeWork className="w-5 h-5" />,
        inactive: <MdOutlineAddHomeWork className="w-5 h-5" />,
      },
      {
        name: "Notifications",
        path: "/notifications",
        active: <RiNotification2Fill className="w-5 h-5" />,
        inactive: <RiNotification2Line className="w-5 h-5" />,
      },
    ],
  },
  {
    isAdmin: true,
    part: "ADMIN CONTROL",
    links: [
      {
        name: "Approvals",
        path: "/approvals",
        active: <BiSolidSelectMultiple className="w-5 h-5" />,
        inactive: <BiSelectMultiple className="w-5 h-5" />,
      },
      {
        name: "Reports",
        path: "/reports",
        active: <MdReport className="w-5 h-5" />,
        inactive: <MdReportGmailerrorred className="w-5 h-5" />,
      },
    ],
  },
  {
    part: "SETTINGS",
    links: [
      {
        name: "Help & Support",
        path: "/support",
        active: <PiSealQuestionFill className="w-5 h-5" />,
        inactive: <PiSealQuestionLight className="w-5 h-5" />,
      },
      {
        name: "Settings",
        path: "/settings",
        active: <IoSettingsSharp className="w-5 h-5" />,
        inactive: <IoSettingsOutline className="w-5 h-5" />,
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { address } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();

  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ADMIN_ADDRESS === address) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [address]);

  const toRender = side_links.filter((link) => {
    if (link.isAdmin) {
      return isAdmin;
    } else {
      return true;
    }
  });

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

      {/* <div className="p-2">
        <div className="relative h-11 w-full min-w-[200px]">
          <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center opacity-50">
            <RiSearch2Line className="w-5 h-5" />
          </div>
          <Input className="pr-10 h-full" disabled placeholder="Search" />
        </div>
      </div> */}

      <nav className="flex min-w-[240px] flex-col flex-1 gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        <Accordion type="multiple" className="w-full">
          {toRender.map((link, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>
                <p className="block mr-auto font-sans text-xs sm:text-sm px-2 py-3 antialiased font-semibold tracking-widest">
                  {link.part}
                </p>
              </AccordionTrigger>
              <AccordionContent>
                <div className="block w-full py-1 font-sans text-sm antialiased font-light leading-normal pl-2 sm:pl-4">
                  <nav className="flex min-w-[240px] flex-col gap-1 p-0 font-sans text-base font-normal">
                    {link.links.map((route) => (
                      <Link
                        key={route.name}
                        href={route.path}
                        className={cn(
                          "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/30 text-sm sm:text-base font-medium",
                          {
                            "bg-secondary/40 hover:bg-secondary/50 text-foreground font-semibold":
                              route.path === pathname,
                          }
                        )}>
                        <span className="grid mr-3 sm:mr-4 place-items-center">
                          {pathname === "/settings"
                            ? route.active
                            : route.inactive}
                        </span>
                        {route.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div
          role="button"
          onClick={async () => {
            router.push("/login");
            logoutUser();
            await disconnect();
          }}
          className="mt-auto flex items-center w-full p-3 h-12 leading-tight transition-all rounded-lg text-[#f96565] outline-none text-start hover:bg-destructive/10 text-sm sm:text-base">
          <span className="grid mr-3 sm:mr-4 place-items-center">
            <AiOutlineLogout className="w-5 h-5" />
          </span>
          Logout
        </div>
      </nav>
    </div>
  );
}
