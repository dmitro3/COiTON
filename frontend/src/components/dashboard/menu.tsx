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

import {
  LogOut,
  WalletMinimal,
  Plus,
  Settings,
  Book,
  User,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { logoutUser } from "@/auth";
import { LogoutModal } from "./logout-modal";

export function Menu() {
  const router = useRouter();

  const { open } = useWeb3Modal();

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
                <p className="text-sm font-semibold uppercase tracking-tight">
                  {credentials?.name}
                </p>
                <span className="text-[11px] sm:text-xs leading-none sm:leading-none font-medium sm:font-normal text-muted-foreground">
                  {shortenAddress(credentials?.address)}
                </span>
              </div>

              <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-secondary">
                {credentials?.avatar ? (
                  <Image
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(
                      credentials.avatar
                    )}`}
                    alt={credentials.name || ""}
                    width={200}
                    height={200}
                    priority
                    quality={100}
                    className="w-full h-full rounded-full object-contain"
                  />
                ) : (
                  <Skeleton className="w-full h-full rounded-full" />
                )}
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
          <DropdownMenuItem onClick={() => router.push("/new")}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Listing</span>
            <DropdownMenuShortcut>⌘+N</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => open()}>
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
        <LogoutModal>
          <div className="hover:bg-red-500/10 hover:text-red-400 flex items-center relative cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </div>
        </LogoutModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
