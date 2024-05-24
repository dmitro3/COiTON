"use client";

import { shortenAddress } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/authcontext";

import {
  LogOut,
  WalletMinimal,
  Plus,
  Settings,
  Book,
  User,
} from "lucide-react";

export function Menu() {
  const router = useRouter();

  const { isFetchingUser, credentials, logoutUser, connectAccount } =
    useAuthContext();

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
                <p className="text-sm font-semibold uppercase tracking-tight">
                  {credentials?.name}
                </p>
                <span className="text-[11px] sm:text-xs leading-none sm:leading-none font-medium sm:font-normal text-muted-foreground">
                  {shortenAddress(credentials?.address)}
                </span>
              </div>

              <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-secondary">
                <Image
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(
                    credentials?.avatar
                  )}`}
                  alt={credentials?.name || ""}
                  width={200}
                  height={200}
                  priority
                  quality={100}
                  className="w-full h-full rounded-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 bg-background">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/assets/${credentials?.address}`)}>
            <Book className="mr-2 h-4 w-4" />
            <span>Assets</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/create-listing")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Listing</span>
            <DropdownMenuShortcut>⌘+L</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={connectAccount}>
            <WalletMinimal className="mr-2 h-4 w-4" />
            <span>Wallet</span>
            <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={logoutUser}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
