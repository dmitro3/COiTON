"use client";

import MaxWrapper from "@/components/shared/max-wrapper";
import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";
import { Copy } from "lucide-react";
import {
  useFetchAllAgreements,
  useFetchListings,
  useStake,
} from "@/hooks/contract";
import { useAuth } from "@/context/authContext";

export default function AgreementsPage() {
  const { credentials } = useAuth();
  const { signPurchaseAgreement } = useFetchListings(false);
  const { handleApproveERC20, handleApproveERC721 } = useStake();
  const { isFetchingAgreements, allAgreements, isError } =
    useFetchAllAgreements();

  return (
    <div className="flex-1 flex flex-col gap-4">
      <MaxWrapper className="mb-6 xl:mb-6 px-0 lg:px-0 xl:px-0 2xl:px-4">
        <div className="bg-transparent md:bg-secondary/20 md:border px-0 md:px-6 rounded-xl">
          <p className="pb-4 md:py-6 text-primary text-sm md:text-base font-bold border-b">
            [ List of all agreements by {shortenAddress(credentials?.address)} ]
          </p>

          {isFetchingAgreements ? (
            <div className="py-4 md:py-6">
              <p className="font-semibold md:font-normal text-xs md:text-sm">
                Loading agreements...
              </p>
            </div>
          ) : isError ? (
            <div className="py-4 md:py-6">
              <p className="font-semibold md:font-normal text-xs md:text-sm">
                {isError}
              </p>
            </div>
          ) : allAgreements && allAgreements.length === 0 ? (
            <div className="py-4 md:py-6">
              <p className="font-semibold md:font-normal text-xs md:text-sm">
                No agreements found, you need to initiate an agreement.
              </p>
            </div>
          ) : (
            allAgreements?.map((agr) => (
              <div
                className="py-4 md:py-6 flex flex-col gap-4 border-b last:border-b-0"
                key={Number(agr.id)}>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-xs md:text-sm">
                      Estate ID:
                    </p>
                  </div>

                  <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-xs md:text-sm text-muted-foreground md:text-foreground">
                    {Number(agr.estateId)}
                  </p>
                </div>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-xs md:text-sm">
                      Initiator:
                    </p>
                  </div>

                  <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-xs md:text-sm text-muted-foreground md:text-foreground">
                    {shortenAddress(`${agr.initiator}`)}{" "}
                    <Copy className="w-4 h-4 cursor-pointer" />
                  </p>
                </div>
                <div className="flex items-start md:items-center flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-xs md:text-sm">
                      Buyer:
                    </p>
                  </div>

                  <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-xs md:text-sm text-muted-foreground md:text-foreground">
                    {shortenAddress(`${agr.buyer}`)}{" "}
                    <Copy className="w-4 h-4 cursor-pointer" />
                  </p>
                </div>
                <div className="flex items-start flex-col md:flex-row">
                  <div className="max-w-[250px] w-full">
                    <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-xs md:text-sm">
                      Signers:
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {agr.validSigners?.map((signer, _key) => (
                      <p
                        className="flex-1 font-bold flex items-center gap-3 text-xs md:text-sm text-muted-foreground"
                        key={_key + 1}>
                        {signer}
                      </p>
                    ))}
                  </div>
                </div>
                {!agr.signed ? (
                  <Button
                    onClick={async () => {
                      await signPurchaseAgreement(
                        agr?.estateId.toString(),
                        agr.buyer,
                        agr?.listing.price.toString(),
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
                    }}>
                    Sign
                  </Button>
                ) : null}

                {agr.executed ? <h2>Executed</h2> : null}
              </div>
            ))
          )}
        </div>
      </MaxWrapper>
    </div>
  );
}
