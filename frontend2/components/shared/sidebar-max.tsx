"use client";

import { useState, useEffect } from "react";
import { RxClock } from "react-icons/rx";
import { RiMenuSearchLine } from "react-icons/ri";
import { TbCoin } from "react-icons/tb";

import { Input } from "../ui/input";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { dummyProperties } from "@/lib/constants";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { getUnApprovedListings } from "@/services/daoService";
import { getAllListings } from "@/services/diamondService";
import { Skeleton } from "../ui/skeleton";

export default function SidebarMax() {
  const pathname = usePathname();
  const isCurrentPage = pathname.includes("/approve") ? "approve" : "listings";

  const [searchBy, setSearchBy] = useState("propertyType");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetchingListings, setIsFetchingListings] = useState<boolean>(true);
  const [properties, setProperties] = useState<any>([]);
  const [filteredProperties, setFilteredProperties] = useState<any>([]);

  const fetchData = async () => {
    try {
      let data;
      if (isCurrentPage === "approve") {
        data = await getUnApprovedListings();
      } else {
        data = await getAllListings();
      }
      setProperties(data);
      setFilteredProperties(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetchingListings(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isCurrentPage]);

  useEffect(() => {
    const filterPropertiesBySearch = () => {
      const term = searchTerm.toLowerCase().trim();
      return properties.filter((prop: any) => {
        if (searchBy === "title") {
          return prop?.title.toLowerCase().includes(term);
        } else if (searchBy === "propertyType") {
          return prop?.propertyType.toLowerCase().includes(term);
        } else if (searchBy === "address") {
          return prop?.address.toLowerCase().includes(term);
        }
        return false;
      });
    };

    if (searchTerm) {
      setFilteredProperties(filterPropertiesBySearch());
    } else {
      setFilteredProperties(properties);
    }
  }, [searchBy, searchTerm, properties]);

  return (
    <div className="w-full h-dvh max-w-[350px] pb-3 border-r sticky top-0 left-0 z-50 bg-background/80 backdrop-blur-2xl">
      <div className="h-14 px-4 flex items-center justify-between border-b">
        <h3 className="text-base font-medium">
          {isCurrentPage === "listings" ? "All Listings" : "Approvals"}
        </h3>

        <Select
          onValueChange={(value) => setSearchBy(value)}
          defaultValue={searchBy}>
          <SelectTrigger className="w-32 py-0 text-sm">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="propertyType">Type</SelectItem>
              <SelectItem value="address">Location</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="h-12 w-full relative">
        <RiMenuSearchLine
          size={18}
          className="absolute top-1/2 -translate-y-1/2 left-4 text-muted-foreground"
        />
        <Input
          placeholder={`Search properties by ${searchBy}...`}
          className="size-full border-0 rounded-none pl-11 pr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="px-4 h-12 flex items-center border-y">
        <p className="text-muted-foreground text-xs">
          Properties from <b className="text-primary">Abia State</b>
        </p>
      </div>

      <div className="flex flex-col">
        {isFetchingListings
          ? Array.from({ length: 4 }).map((_, _key) => (
              <div
                className="p-4 flex gap-4 bg-secondary/30 border-b border-background"
                key={_key}>
                <Skeleton className="size-9 rounded-sm" />

                <div className="flex flex-col flex-1">
                  <Skeleton className="h-3 w-24 rounded-sm" />
                  <Skeleton className="h-2 mt-2 w-12 rounded-sm" />

                  <Skeleton className="h-2 w-[calc(100%-10%)] rounded-sm mt-4" />

                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="rounded-full h-4 w-14" />
                    <Skeleton className="rounded-full h-4 w-14" />
                  </div>
                </div>
              </div>
            ))
          : filteredProperties?.map((prop: any) => {
              const isActive =
                pathname ===
                `/${isCurrentPage === "listings" ? "listing" : "approve"}/${
                  prop?.propertyId
                }`;

              return (
                <Link
                  href={`/${
                    isCurrentPage === "listings" ? "listing" : "approve"
                  }/${prop?.propertyId}`}
                  key={prop?.propertyId}
                  className={cn(
                    "border-b p-4 flex gap-4 bg-background hover:bg-secondary/30 transition duration-300 cursor-pointer",
                    {
                      "bg-secondary/50 hover:bg-secondary/50": isActive,
                    }
                  )}>
                  <div className="size-9 rounded-sm bg-secondary relative overflow-hidden">
                    <Image
                      src={prop?.coverImage}
                      alt={prop?.title}
                      fill
                      priority
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <h3 className="text-sm font-medium line-clamp-1">
                      {prop?.title || "No title"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {prop?.propertyType || "No property type"}
                    </p>

                    <p className="text-xs text-muted-foreground line-clamp-1 mt-3">
                      {prop?.address}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="border rounded-full py-0.5 px-2 flex items-center text-muted-foreground">
                        <RxClock size={12} className="mr-1" />
                        <p className="text-xs font-normal">
                          {formatDate(prop?.timestamp).formattedDate}
                        </p>
                      </div>
                      <div className="border rounded-full py-0.5 px-2 flex items-center text-muted-foreground">
                        <TbCoin size={12} className="mr-1" />
                        <p className="text-xs font-normal">
                          {prop?.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>
    </div>
  );
}
