"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchListings, useStake } from "@/hooks/useFetchBackend";
import { Bath, BedSingle, CheckCheck, MapPin } from "lucide-react";
import TradingViewWidget from "@/components/shared/trading-view-widget";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import { InitiatePurchaseTransaction } from "@/components/shared/initiate-transaction";
import { Button } from "@/components/ui/button";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

export default function ListingDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const transformListing = (listing: any) => ({
    id: listing[0],
    owner: listing[1],
    region: listing[2],
    postalCode: Number(listing[3]),
    description: listing[4].split(";")[0],
    features: listing[4].split(";")[1].split("\n"),
    price: Number(listing[5]),
    images: listing[6].split(";"),
    tokenId: listing[7],
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
  } = useFetchListings();
  const { handleApproveERC20, handleApproveERC721 } = useStake();
  // const { address } = useWeb3ModalAccount();
  // console.log(address);
  const [isFetchingListing, setIsFetchingListing] = useState(false);
  const [listingData, setListingData] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<string>("");
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
            setSelectedImage(lt.images[0]);
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
  }, [isLoading, listings, params.id, router]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  if (isFetchingListing || isLoading) {
    return <p>Loading...</p>;
  }

  // console.log(purchaseSigner)

  return (
    <div className="flex-1 flex flex-col gap-6 pb-6">
      <div className="aspect-[1.4] md:aspect-[1.8] lg:aspect-[2.5] xl:aspect-auto xl:h-[535px] max-w-[1558px] w-full mx-auto overflow-hidden relative">
        <div className="w-full h-full bg-secondary rounded-xl overflow-hidden mb-3">
          <Image
            src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${
              selectedImage || listingData?.images[0]
            }`}
            alt="Main Image"
            width={3840}
            height={2160}
            priority
            quality={100}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto w-full relative xl:absolute xl:bottom-0 xl:left-0 p-3 bg-background/80">
          {listingData?.images.map((image: string, index: number) => (
            <div
              key={index}
              onClick={() => handleImageClick(image)}
              className={cn(
                "w-24 aspect-[1.1] cursor-pointer bg-secondary rounded-md brightness-50 overflow-hidden",
                {
                  "brightness-100 border-2 border-primary":
                    selectedImage === image,
                }
              )}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${image}`}
                alt={`Image ${index}`}
                width={200}
                height={200}
                priority
                quality={100}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col w-full max-w-[1200px] mx-auto gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl md:text-4xl font-bold">
            5 bedroom duplex vgc.
          </h1>
          <p className="text-sm md:text-base truncate max-w-[500px] w-full">
            {listingData?.description}
          </p>

          <h1 className="text-xl md:text-2xl font-bold text-primary">
            ₦ {listingData?.price?.toLocaleString()}
          </h1>
          <p className="text-sm md:text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {listingData?.region.split(";").join(", ")}.
          </p>

          <div className="flex items-center gap-4 mt-4">
            {!purchaseAgreement || !purchaseAgreement.success ? (
              <InitiatePurchaseTransaction
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
                type="submit"
              >
                Sign Purchase Agreement
              </Button>
            ) : null}

            <Button variant="secondary">View Market</Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="p-4 md:p-6 bg-secondary/20 flex-1 rounded border sm:border-0">
            <h2 className="text-base md:text-lg font-bold mb-2 md:mb-4">
              Description
            </h2>
            <pre className="font-sans text-sm md:text-base text-muted-foreground whitespace-pre-wrap">
              {listingData?.description}
            </pre>
          </div>

          <div className="p-4 md:p-6 bg-secondary/20 max-w-full lg:max-w-[450px] flex-1 rounded border sm:border-0">
            <h2 className="text-base md:text-lg font-bold mb-2 md:mb-4">
              Overview
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
              <p>{formatDate(listingData?.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="p-4 md:p-6 bg-secondary/20 rounded border sm:border-0 w-full">
            <h2 className="text-base md:text-lg font-bold mb-2 md:mb-4">
              Details
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="font-bold">Property Id:</span>
                <p className="flex-1 text-sm md:text-base">61721</p>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="font-bold">Price:</span>
                <p className="flex-1 text-sm md:text-base">₦ 280,000,000</p>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="font-bold">Bedrooms:</span>
                <p className="flex-1 text-sm md:text-base">5</p>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="font-bold">Bathrooms:</span>
                <p className="flex-1 text-sm md:text-base">5</p>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="font-bold">Living Rooms:</span>
                <p className="flex-1 text-sm md:text-base">2</p>
              </div>
              <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                <span className="font-bold">Garages:</span>
                <p className="flex-1 text-sm md:text-base">7</p>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 bg-secondary/20 rounded border sm:border-0 w-full">
            <h2 className="text-base md:text-lg font-bold mb-2 md:mb-4">
              Features
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {listingData?.features?.map((feature: string, _key: number) => (
                <div
                  className="flex items-center gap-2 text-sm md:text-base text-muted-foreground"
                  key={_key}
                >
                  <CheckCheck className="w-5 h-5 text-primary" />
                  <p className="flex-1 text-sm md:text-base">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-secondary/20 rounded border sm:border-0 w-full">
          <TradingViewWidget title="5 bedroom duplex vgc." />
        </div>
      </div>
    </div>
  );
}
