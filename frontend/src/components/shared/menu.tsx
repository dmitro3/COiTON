"use client";

import { shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "@/context/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutUser } from "@/auth";
import { usePathname, useRouter } from "next/navigation";
import { useDisconnect } from "@web3modal/ethers/react";

export function Menu() {
  const router = useRouter();

  const { disconnect } = useDisconnect();
  const { isFetchingUser, credentials } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer">
          {isFetchingUser ? (
            <div className="flex items-center text-sm gap-3">
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="w-20 h-4 rounded-full" />
                <Skeleton className="w-40 h-4 rounded-full" />
              </div>
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
          ) : (
            <div className="flex items-center text-sm gap-3">
              <div className="flex flex-col items-end">
                {credentials?.name}{" "}
                <span className="text-xs text-muted-foreground">
                  {shortenAddress(credentials?.address)}
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-secondary">
                <Image
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    credentials?.avatar
                  )}`}
                  alt={credentials?.name || ""}
                  width={40}
                  height={40}
                  priority
                  quality={100}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 bg-background">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/assets/${credentials?.address}`)}>
            Assets
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            router.push("/login");
            logoutUser();
            await disconnect();
          }}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
