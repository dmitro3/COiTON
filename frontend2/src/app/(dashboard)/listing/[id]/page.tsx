"use client";

import { useEffect, useState } from "react";
import MaxWrapper from "@/components/shared/max-wrapper";
import TradingChart from "@/components/shared/trading-chart";
import { Button } from "@/components/ui/button";
import {
  Bath,
  BedSingle,
  CheckCheck,
  Clock,
  MapPin,
  Printer,
  Share2,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InitiatePurchaseAgreement from "@/components/dashboard/initiate-agreement";
import { useFetchListings, useStake } from "@/hooks";
import ListingDetailsLoader from "@/components/dashboard/listing-details-loader";

export default function ListingDetails({ params }: { params: { id: string } }) {
  // CAROUSEL STATE
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const transformListing = (listing: any) => ({
    id: listing[0],
    owner: listing[1],
    region: listing[2],
    postalCode: Number(listing[3]),
    description: listing[4].split(";")[0],
    features: listing[4].split(";")[1].split("\n"),
    price: Number(listing[5]),
    images: listing[6].split(";"),
    tokenId: Number(listing[7]),
    coverImage: listing[8],
    createdAt: Number(listing[9]),
  });

  const router = useRouter();
  const {
    listings,
    isLoading,
    getUserInitiatedPurchaseArgument,
    getEstateSigner,
    signPurchaseAgreement,
  } = useFetchListings(true);
  const { handleApproveERC20, handleApproveERC721 } = useStake();
  const [isFetchingListing, setIsFetchingListing] = useState(false);
  const [listingData, setListingData] = useState<any>();
  const [purchaseAgreement, setPurchaseAgreement] = useState<any>(null);
  const [purchaseSigner, setPurchaseSigner] = useState<any>(null);

  useEffect(() => {
    const fetchListingData = async () => {
      if (!isLoading) {
        try {
          setIsFetchingListing(true);

          const foundListing = listings.find(
            (item: any) => item[0] === params.id
          );
          if (foundListing) {
            const lt = transformListing(foundListing);
            setListingData(lt);
            setPurchaseAgreement(
              await getUserInitiatedPurchaseArgument(lt.tokenId.toString())
            );
            setPurchaseSigner(await getEstateSigner(lt.tokenId.toString()));
          } else {
            toast.error("Listing not found");
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Error:", error);
          router.push("/dashboard");
        } finally {
          setIsFetchingListing(false);
        }
      }
    };

    fetchListingData();
  }, [
    getEstateSigner,
    getUserInitiatedPurchaseArgument,
    isLoading,
    listings,
    params.id,
    router,
  ]);

  function minus30Percent(number: number) {
    number = Number(number);
    const thirtyPercent = number * 0.3;
    const result = number - thirtyPercent;
    return result;
  }

  if (isFetchingListing || isLoading) return <ListingDetailsLoader />;

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col my-6 md:my-10 mx-auto max-w-[1050px] w-full">
        <h1 className="text-2xl md:text-3xl font-semibold">
          Luxury Sunset Vista Villa
        </h1>
        <div className="flex flex-col gap-1 md:flex-row md:gap-3">
          <p className="text-xs md:text-sm lg:text-lg font-medium flex items-center">
            <MapPin className="mr-2 w-4 h-4" />
            {listingData?.region.split(";").join(", ")}
          </p>
          <p className="text-xs md:text-sm lg:text-lg font-medium flex items-center">
            <Clock className="mr-2 w-4 h-4" /> 11 Days Ago
          </p>
        </div>
        <div className="flex items-center md:items-end justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t">
          <h2 className="text-xl md:text-2xl font-medium">
            <span className="font-bold">
              ₦ {listingData?.price?.toLocaleString()}
            </span>{" "}
            <span className="text-base md:text-lg text-primary italic line-through">
              ₦ {minus30Percent(listingData?.price).toLocaleString()}
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              className="w-9 md:w-11 h-9 md:h-11 rounded-full"
              variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => window.print()}
              size="icon"
              className="w-9 md:w-11 h-9 md:h-11 rounded-full"
              variant="outline">
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="mt-6 md:mt-10 w-max flex items-center gap-6">
          {!purchaseAgreement || !purchaseAgreement.success ? (
            <InitiatePurchaseAgreement
              callback={(success: boolean, data) => {
                if (success) {
                  setPurchaseAgreement({ success: true, data });
                }
              }}
              estateId={listingData?.tokenId.toString()}
              agentId={listingData?.owner}
            />
          ) : null}

          {purchaseSigner &&
          purchaseSigner.success &&
          Object.keys(purchaseSigner.data).length != 0 &&
          !purchaseSigner.data[1] ? (
            <Button
              onClick={async () => {
                await signPurchaseAgreement(
                  listingData?.tokenId.toString(),
                  purchaseSigner.data[0][2],
                  listingData?.price.toString(),
                  (approval) =>
                    handleApproveERC20(
                      approval,
                      process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string
                    ),
                  (approval) =>
                    handleApproveERC721(
                      approval,
                      process.env.NEXT_PUBLIC_DIAMOND_ADDRESS as string
                    )
                );
              }}
              type="submit">
              Sign Purchase Agreement
            </Button>
          ) : null}
        </div>
      </div>
      <MaxWrapper className="my-6 xl:my-6 px-0 lg:px-0 xl:px-0 2xl:px-4 flex flex-col gap-6">
        <div className="w-full aspect-[1.6] xl:aspect-[1.8] flex gap-2 flex-col xl:flex-row">
          <Carousel
            setApi={setApi}
            className="w-full h-full flex flex-col gap-3 aspect-[1.6] xl:aspect-[1.8]">
            <div className="p-1 md:p-1.5 bg-secondary rounded-lg sm:rounded-xl flex-1 h-auto">
              <CarouselContent className="aspect-[1.6] xl:aspect-[1.8] rounded-lg sm:rounded-xl bg-background">
                {listingData?.images
                  .split(";")
                  .map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${image}`}
                        alt={`Image ${index}`}
                        width={200}
                        height={200}
                        priority
                        quality={100}
                        className="h-full w-full object-cover rounded-lg sm:rounded-xl"
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </div>
            <div className="flex items-center justify-between gap-4 mx-auto max-w-[1050px] w-full">
              <p className="text-sm md:text-base">
                <b>{current}</b> of <b>{count}</b>
              </p>
              <div className="flex items-center gap-2">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </div>
          </Carousel>
        </div>
      </MaxWrapper>
      <div className="flex flex-col gap-10 my-6 md:my-10 mx-auto max-w-[1050px] w-full">
        <div className="flex flex-col">
          <h2 className="text-sm md:text-base font-medium uppercase mb-2 md:mb-4">
            Property Description
          </h2>
          <pre className="font-sans text-sm md:text-base text-muted-foreground whitespace-pre-wrap">
            {listingData?.description.split(";")[0]}
          </pre>
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm md:text-base font-medium uppercase mb-2 md:mb-4">
            Property Overview
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
              <BedSingle className="w-5 h-5" />
              <p>5 Bedrooms</p>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
              <Bath className="w-5 h-5" />
              <p>5 Bathrooms</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground mt-2">
            <span className="font-bold">Published On:</span>
            <p>{formatDate(Number(listingData?.createdAt))}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-sm md:text-base font-medium uppercase mb-2 md:mb-4">
            Amenities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-3">
            {listingData?.description
              ?.split(";")[1]
              .split("\n")
              .map((feature: string, _key: number) => (
                <div
                  className="flex items-start gap-2 text-sm md:text-base text-muted-foreground"
                  key={_key}>
                  <CheckCheck className="w-5 h-5 text-primary" />
                  <p className="flex-1 text-sm">{feature}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="w-full p-0 sm:p-4 md:p-6 bg-background rounded sm:rounded-lg md:rounded-xl border-0 sm:border">
          <TradingChart title="Luxury Sunset Vista Villa" />
        </div>
      </div>
    </div>
  );
}
