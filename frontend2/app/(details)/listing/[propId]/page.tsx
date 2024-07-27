"use client";

import InitiatePurchaseAgreement from "@/components/shared/initiate-agreement";
import Overview from "@/components/shared/overview";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/useFetch";
import { cn, formatDate } from "@/lib/utils";
import { useAuth } from "@/providers/authprovider";
import { approveListing } from "@/services/daoService";
import {
  getEstateSigner,
  getInitiatedAgreements,
  getListingById,
} from "@/services/diamondService";
import { Loader } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiChevronUp, BiChevronDown } from "react-icons/bi";
import { toast } from "sonner";
import { signPurchaseAgreement } from "@/services/diamondService";
import { approveERC20 } from "@/services/erc20Service";
import { approveERC721 } from "@/services/erc721Service";
import { variables } from "@/utils/env";

const tabs = ["overview", "images"];

export default function PropertyDetailPage({
  params: { propId },
}: {
  params: { propId: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isCurrentPage = pathname.includes("/approve")
    ? "approvals"
    : "listings";

  const [currentTab, setCurrentTab] = useState(tabs[1]);
  const [purchaseAgreement, setPurchaseAgreement] = useState<any>(null);
  const [purchaseSigner, setPurchaseSigner] = useState<any>(null);
  const [isSigningAgreement, setIsSigningAgreement] = useState(false);

  const { credentials } = useAuth();

  const {
    fn: getListingByIdFn,
    data: property,
    isLoading,
    isError,
  }: IFetchHook = useFetch(getListingById, {
    selectId: propId.toString(),
    currentPath: isCurrentPage,
  });

  const fetchAgr = async () => {
    const pAgreement = await getInitiatedAgreements(property?.id);
    const pSigner = await getEstateSigner(property?.id);

    setPurchaseAgreement(pAgreement);
    setPurchaseSigner(pSigner);
  };

  useEffect(() => {
    getListingByIdFn();
  }, [propId]);

  function minus30Percent(number: number) {
    number = Number(number);
    const thirtyPercent = number * 0.3;
    const result = number - thirtyPercent;
    return result;
  }

  const handleSignAgreement = async (agr: any) => {
    try {
      setIsSigningAgreement(true);
      await signPurchaseAgreement({
        estateId: Number(agr?.id),
        buyer: purchaseSigner?.purchaseAgreement?.buyer,
        price: agr?.price.toString(),
        handleStake: (approval: any) =>
          approveERC20({
            recipient: variables?.diamondAddress,
            amount: approval,
          }),
        handleStakeERC721: (approval: any) =>
          approveERC721({
            recipient: variables?.diamondAddress,
            amount: approval,
          }),
      });
    } catch (error) {
      console.error("Error signing agreement:", error);
    } finally {
      setIsSigningAgreement(false);
    }
  };

  if (property) {
    fetchAgr();
  }

  if (isError) {
    router.push("/listing");
  }

  return isLoading ? (
    <div className="flex-1 flex">
      <div className="h-full flex-1 pb-6">
        <div className="h-14 px-5 flex items-center gap-2 border-b bg-background sticky top-0 right-0 z-40">
          <Skeleton className="w-16 h-3 rounded-sm" />
        </div>

        <div className="flex flex-col">
          <div className="py-6 px-8">
            <Skeleton className="h-5 w-52 rounded-lg" />

            <Skeleton className="h-4 w-full rounded-md mt-4" />
            <Skeleton className="h-4 w-[calc(100%-20%)] rounded-md mt-2" />
          </div>

          <div className="w-full border-b px-8 flex items-center gap-4">
            <Skeleton className="w-16 h-3 rounded-sm mb-2" />
            <Skeleton className="w-16 h-3 rounded-sm mb-2" />
          </div>
        </div>

        <div className="p-8 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, _key) => (
            <Skeleton key={_key} className="rounded-lg aspect-[1] w-full" />
          ))}
        </div>

        <div className="px-8 flex items-center gap-6">
          <Skeleton className="h-14 rounded-xl flex-1" />
          <Skeleton className="h-14 rounded-xl flex-1" />
        </div>
      </div>

      <div className="min-w-[384px] h-dvh border-x sticky top-0 left-0 z-50 hidden xl:flex">
        <Overview property={property} isLoading={isLoading} />
      </div>
    </div>
  ) : (
    <div className="flex-1 flex">
      <div className="h-full flex-1 pb-6">
        <div className="h-14 px-5 flex items-center gap-2 border-b bg-background sticky top-0 right-0 z-40">
          <p className="text-sm text-muted-foreground font-normal mr-3">
            <b className="text-primary">{property?.title || "No title"}</b>
          </p>

          <Button size={"icon"} variant={"outline"} className="size-7">
            <BiChevronUp size={22} />
          </Button>
          <Button size={"icon"} variant={"outline"} className="size-7">
            <BiChevronDown size={22} />
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="py-6 px-8">
            <h1 className="text-xl md:text-2xl font-medium">
              {property?.title || "No title"}
            </h1>
            <pre className="text-base font-sans text-muted-foreground font-normal mt-2 whitespace-pre-wrap flex-1 line-clamp-2">
              {property?.description}
            </pre>
          </div>

          <div className="w-full border-b px-8 flex items-center">
            {tabs.map((tab) => (
              <p
                key={tab}
                className={cn(
                  "text-sm font-medium cursor-pointer text-muted-foreground capitalize relative pb-1 px-3",
                  {
                    "text-foreground": currentTab === tab,
                  }
                )}
                onClick={() => setCurrentTab(tab)}>
                {tab}

                {currentTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-px bg-foreground" />
                )}
              </p>
            ))}
          </div>
        </div>

        <div className="px-8 mt-8 flex items-center gap-4">
          <InitiatePurchaseAgreement
            agentId={credentials?.address}
            estateId={property?.id.toString()}
            disabled={purchaseAgreement}
            callback={(success: boolean, data) => {
              if (success) {
                setPurchaseAgreement(data);
              }
            }}>
            <Button disabled={purchaseAgreement} className="w-max">
              {purchaseAgreement ? "Agreement Initiated" : "Initiate Agreement"}
            </Button>
          </InitiatePurchaseAgreement>

          <Button
            onClick={() => handleSignAgreement(property)}
            disabled={purchaseSigner?.hasSigned || isSigningAgreement}>
            {isSigningAgreement ? (
              <>
                <Loader className="size-4 mr-2 animate-spin" /> Please wait...
              </>
            ) : (
              "Sign Agreement"
            )}
          </Button>
        </div>

        {currentTab === "images" ? (
          <div className="p-8 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
            {property?.images?.map((img: string) => (
              <div
                key={img}
                className="bg-secondary rounded-lg aspect-[1] w-full relative">
                <Image
                  src={img}
                  alt={property?.owner!}
                  fill
                  priority
                  className="size-full rounded-[inherit] object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8">
            <div className="flex flex-col bg-background/80 backdrop-blur-xl rounded-xl border">
              <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row gap-2 items-start justify-between border-b p-4">
                <p className="text-sm font-medium max-w-[150px] w-full">
                  Price
                </p>
                <p className="font-normal flex-1 flex items-end gap-4 text-base leading-none">
                  <span className="leading-none">
                    $ {property?.price?.toLocaleString()}
                  </span>{" "}
                  <span className="text-initial text-xs italic line-through leading-none">
                    $ {minus30Percent(property?.price).toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row gap-2 items-start justify-between border-b p-4">
                <p className="text-sm font-medium max-w-[150px] w-full">
                  Description
                </p>
                <pre className="font-normal flex-1 flex flex-col gap-1 font-sans whitespace-pre-wrap text-sm text-muted-foreground">
                  {property?.description}
                </pre>
              </div>
              <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row gap-2 items-start justify-between border-b p-4">
                <p className="text-sm font-medium max-w-[150px] w-full">Type</p>
                <p className="font-normal flex-1 flex flex-col gap-1 text-sm text-muted-foreground">
                  {property?.propertyType || "Property Type"}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row gap-2 items-start justify-between border-b p-4">
                <p className="text-sm font-medium max-w-[150px] w-full">
                  Created At
                </p>
                <p className="font-normal flex-1 flex flex-col gap-1 text-sm text-muted-foreground">
                  {formatDate(property?.timestamp).formattedDateWithTime}
                </p>
              </div>
              <div className="flex flex-col lg:flex-row xl:flex-col 2xl:flex-row gap-2 items-start justify-between p-4">
                <p className="text-sm font-medium max-w-[150px] w-full">
                  Location
                </p>
                <div className="flex flex-col gap-3 flex-1 w-full">
                  <p className="font-normal flex-1 flex flex-col gap-1 text-sm text-muted-foreground">
                    {property?.address}
                  </p>

                  <iframe
                    src={`https://www.google.com/maps?&hl=es;z=14&output=embed`}
                    className="w-full aspect-video border rounded-lg"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-w-[384px] h-dvh border-x sticky top-0 left-0 z-50 hidden xl:flex">
        <Overview property={property} isLoading={isLoading} />
      </div>
    </div>
  );
}
