"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchUnApprovedListings } from "@/hooks/useFetchBackend";
import { getDaoContract, getProvider, shortenAddress } from "@/lib/utils";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ApprovalsPage() {
  const router = useRouter();

  const { walletProvider }: any = useWeb3ModalProvider();
  const { listings, isLoading } = useFetchUnApprovedListings();

  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  async function approveListing(state: string, index: number, id: string) {
    const readWriteProvider = getProvider(walletProvider);
    const signer = await readWriteProvider.getSigner(
      process.env.NEXT_PUBLIC_ADMIN_ADDRESS
    );
    const contract = getDaoContract(signer);

    try {
      setIsApproving(true);

      const tx = await contract.approveListing(state, index, id);
      console.log(tx);

      toast("Transaction sent successfully", {
        description: "You are being redirected to the listing",
      });
      router.push(`/listing/${id}`);

      setIsApproved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">
        Unapproved Listings
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, _key) => (
            <div
              key={_key + Math.random() * 50}
              className="flex flex-col gap-2 w-full">
              <Skeleton className="w-full aspect-[1.3]" />

              <div className="flex flex-col gap-2">
                <Skeleton className="w-[calc(100%-20%)] h-3 rounded-3xl" />
                <Skeleton className="w-full h-3 rounded-3xl" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="w-full h-9" />
                <Skeleton className="w-full h-9" />
              </div>
            </div>
          ))
        ) : listings?.length === 0 ? (
          <p>No listings to approve</p>
        ) : (
          listings?.map((listing: any, _key: number) => {
            const lt = {
              owner: listing[0][0],
              agentId: listing[0][1],
              region: listing[0][2].split(";"),
              postalCode: Number(listing[0][3]),
              description: listing[0][4].split(";")[0],
              features: listing[0][4].split(";")[1].split("\n"),
              price: Number(listing[0][5]),
              images: listing[0][6].split(";"),
              coverImage: listing[0][7],
              id: listing[0][8],
            };

            console.log(`Listing ${_key + 1}:`, listing[2]);

            return (
              <div className="flex flex-col gap-2" key={_key}>
                <Link
                  href={`/listing/${lt.id}`}
                  className="flex flex-col gap-2 w-full group">
                  <div className="w-full aspect-[1.3] bg-card overflow-hidden rounded-md">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${lt.coverImage}`}
                      alt={lt.owner}
                      width={700}
                      height={700}
                      quality={100}
                      priority
                      className="w-full h-full object-cover group-hover:scale-125 transition-all duration-300"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h1 className="text-sm font-medium text-muted-foreground">
                      {shortenAddress(lt.owner)}
                    </h1>
                    <p className="text-sm line-clamp-1">{lt.description}</p>
                  </div>
                </Link>

                <div className="flex gap-2">
                  <Button
                    className="w-full"
                    disabled={isApproving || isApproved}
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();

                      approveListing(
                        lt.region[0],
                        Number(listing[2].toString()),
                        lt.id
                      );
                      // console.log({state:lt.region[0], index:_key + 1, id:lt.id});
                    }}>
                    {isApproving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                  <Button className="w-full" variant="destructive" disabled>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
