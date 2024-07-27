"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { RiSearch2Line } from "react-icons/ri";
import { Input } from "../ui/input";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { LogoutModal } from "./logout-modal";

const side_links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M15.0001 17C14.2006 17.6224 13.1504 18 12.0001 18C10.8499 18 9.79965 17.6224 9.00012 17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M2.35151 13.2135C1.99849 10.9162 1.82198 9.76763 2.25629 8.74938C2.69059 7.73112 3.65415 7.03443 5.58126 5.64106L7.02111 4.6C9.41841 2.86667 10.6171 2 12.0001 2C13.3832 2 14.5818 2.86667 16.9791 4.6L18.419 5.64106C20.3461 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6487 13.2135L21.3477 15.1724C20.8473 18.4289 20.597 20.0572 19.4291 21.0286C18.2612 22 16.5538 22 13.1389 22H10.8613C7.44646 22 5.73903 22 4.57112 21.0286C3.40321 20.0572 3.15299 18.4289 2.65255 15.1724L2.35151 13.2135Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Tradings",
    path: "/tradings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M7 18V16M12 18V15M17 18V13M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.99219 11.4863C8.14729 11.5581 13.0341 11.2328 15.8137 6.82132M13.9923 6.28835L15.8678 5.98649C16.0964 5.95738 16.432 6.13785 16.5145 6.35298L17.0104 7.99142"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "List Property",
    path: "/list",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M12 8V16M16 12L8 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Agreements",
    path: "/agreements",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M9 22C9.35984 22 10.6908 21.3926 12.0494 20.1778M12.0494 20.1778C13.2078 19.1419 14.3863 17.6643 15 15.7452C16.3333 11.5753 8.33333 15.7452 11 19.2201C11.3281 19.6476 11.6815 19.9601 12.0494 20.1778ZM12.0494 20.1778C13.6521 21.1259 15.5311 20.274 16.8041 19.2944C17.1932 18.995 17.3877 18.8453 17.5038 18.8919C17.62 18.9385 17.6878 19.2064 17.8236 19.7422C18.2581 21.4569 19.5415 22.841 21 20.6105"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 13L20 7.89072C20 6.17637 20 5.31919 19.732 4.63459C19.3013 3.53399 18.3902 2.66585 17.2352 2.25535C16.5168 2 15.6173 2 13.8182 2C10.6698 2 9.09563 2 7.83836 2.44686C5.81714 3.16523 4.22281 4.68448 3.46894 6.61052C3 7.80859 3 9.30864 3 12.3088L3 14.8859C3 17.9936 3 19.5474 3.8477 20.6265C4.09058 20.9356 4.37862 21.2101 4.70307 21.4416C5.07016 21.7034 5.48961 21.8804 6 22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 12C3 10.159 4.49238 8.66667 6.33333 8.66667C6.99912 8.66667 7.78404 8.78333 8.43137 8.60988C9.00652 8.45576 9.45576 8.00652 9.60988 7.43136C9.78333 6.78404 9.66667 5.99912 9.66667 5.33333C9.66667 3.49238 11.1591 2 13 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Reports",
    path: "/reports",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M11.992 16H12.001"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13L12 8.99997"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Approvals",
    path: "/approve",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M14.9805 7.01562C14.9805 7.01562 15.4805 7.51562 15.9805 8.51562C15.9805 8.51562 17.5687 6.01562 18.9805 5.51562"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.99485 2.02141C7.49638 1.91562 5.56612 2.20344 5.56612 2.20344C4.34727 2.29059 2.01146 2.97391 2.01148 6.9646C2.0115 10.9214 1.98564 15.7993 2.01148 17.744C2.01148 18.932 2.7471 21.7034 5.29326 21.8519C8.3881 22.0324 13.9627 22.0708 16.5205 21.8519C17.2051 21.8133 19.4846 21.2758 19.7731 18.7957C20.072 16.2264 20.0125 14.4407 20.0125 14.0157"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.9999 7.01562C21.9999 9.77705 19.7591 12.0156 16.995 12.0156C14.231 12.0156 11.9902 9.77705 11.9902 7.01562C11.9902 4.2542 14.231 2.01562 16.995 2.01562C19.7591 2.01562 21.9999 4.2542 21.9999 7.01562Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.98047 13.0156H10.9805"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M6.98047 17.0156H14.9805"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    agent: true,
  },
  {
    name: "Help & Support",
    path: "/support",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-6 h-6"
        fill="none">
        <path
          d="M12 22L10 16H2L4 22H12ZM12 22H16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13V12.5C12 10.6144 12 9.67157 11.4142 9.08579C10.8284 8.5 9.88562 8.5 8 8.5C6.11438 8.5 5.17157 8.5 4.58579 9.08579C4 9.67157 4 10.6144 4 12.5V13"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 13C19 14.1046 18.1046 15 17 15C15.8954 15 15 14.1046 15 13C15 11.8954 15.8954 11 17 11C18.1046 11 19 11.8954 19 13Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M10 4C10 5.10457 9.10457 6 8 6C6.89543 6 6 5.10457 6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M14 17.5H20C21.1046 17.5 22 18.3954 22 19.5V20C22 21.1046 21.1046 22 20 22H19"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function SidebarMini() {
  const pathname = usePathname();

  const shouldBecomeSmall =
    pathname.includes("/approve") || pathname.includes("/listing");

  return (
    <div
      className={cn(
        "w-full h-dvh max-w-[50px] pb-3 border-x sticky top-0 left-0 z-50 bg-background/80 backdrop-blur-2xl",
        {
          "min-w-[20rem] px-4": !shouldBecomeSmall,
        }
      )}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col items-center">
          <Link
            href="/"
            className={cn("h-14 w-full flex items-center justify-center", {
              "justify-start": !shouldBecomeSmall,
            })}>
            <Image
              src="/img/logo.png"
              alt="logo"
              width={30}
              height={30}
              priority
            />
          </Link>

          {!shouldBecomeSmall && (
            <div className="relative h-10 w-full my-2">
              <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center">
                <RiSearch2Line className="w-5 h-5 text-muted-foreground" />
              </div>
              <Input
                className="pr-10 pl-4 h-full"
                placeholder="Search property..."
              />
            </div>
          )}

          <div className="flex flex-col gap-px w-full">
            {side_links.map((route) => {
              const isActive =
                route.path === pathname || pathname.includes(route.path);

              return shouldBecomeSmall ? (
                <Link
                  href={route.path}
                  key={route.path}
                  className={cn(
                    "size-12 hover:bg-secondary/50 relative transition duration-300 cursor-pointer group flex items-center justify-center",
                    {
                      "bg-secondary/50 hover:bg-secondary/70": isActive,
                    }
                  )}>
                  {isActive && (
                    <span className="h-full w-px bg-secondary-foreground absolute top-0 left-0" />
                  )}

                  <span
                    className={cn(
                      "grid place-items-center text-muted-foreground size-6",
                      {
                        "text-primary": isActive,
                      }
                    )}>
                    {route.icon}
                  </span>
                </Link>
              ) : (
                <Link
                  key={route.name}
                  href={route.path}
                  className={cn(
                    "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/30 hover:text-foreground text-sm font-medium group",
                    {
                      "bg-secondary/50 hover:bg-secondary/70 hover:text-primary text-primary font-semibold":
                        isActive,
                    }
                  )}>
                  <span className="grid mr-3 place-items-center size-6">
                    {route.icon}
                  </span>
                  {route.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-px mt-auto">
          {shouldBecomeSmall ? (
            <>
              <Link
                href="/settings"
                className="size-12 hover:bg-secondary/50 relative transition duration-300 cursor-pointer group flex items-center justify-center">
                <Settings
                  size={22}
                  className="group-hover:text-primary text-muted-foreground transition duration-300"
                />
              </Link>{" "}
              <div className="size-12 hover:bg-secondary/50 relative transition duration-300 cursor-pointer group flex items-center justify-center">
                <LogOut
                  size={22}
                  className="group-hover:text-primary text-muted-foreground transition duration-300"
                />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/settings"
                className={cn(
                  "flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-secondary/50 hover:text-foreground text-sm font-medium group",
                  {
                    "bg-primary/5 hover:bg-primary/10 hover:text-primary text-primary font-semibold":
                      pathname === "/settings",
                  }
                )}>
                <span className="grid mr-3 place-items-center">
                  <Settings size={22} />
                </span>
                Settings
              </Link>

              <LogoutModal>
                <div className="flex items-center w-full p-3 leading-tight transition-all rounded-lg text-muted-foreground outline-none text-start hover:bg-red-500/10 hover:text-red-400 text-sm font-medium group cursor-pointer">
                  <span className="grid mr-3 place-items-center">
                    <LogOut size={22} />
                  </span>
                  Log Out
                </div>
              </LogoutModal>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
