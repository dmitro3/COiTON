"use client";

import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { truncate } from "@/lib/utils";
import { useAuth } from "@/providers/authprovider";
import {
  getAllAgreements,
  signPurchaseAgreement,
} from "@/services/diamondService";
import { approveERC20 } from "@/services/erc20Service";
import { approveERC721 } from "@/services/erc721Service";
import { variables } from "@/utils/env";
import { Copy, Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function AgreementsPage() {
  const [isSigningAgreement, setIsSigningAgreement] = useState(false);

  const { credentials } = useAuth();
  const {
    fn: getAllAgreementsFn,
    data: allAgreements,
    isLoading: isFetchingAgreements,
  }: IFetchHook = useFetch(getAllAgreements);

  useEffect(() => {
    getAllAgreementsFn();
  }, []);

  const handleSignAgreement = async (agr: any) => {
    try {
      setIsSigningAgreement(true);
      await signPurchaseAgreement({
        estateId: agr?.estateId.toString(),
        buyer: agr.buyer,
        price: agr?.listing.price.toString(),
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

  return (
    <div className="flex-1 flex flex-col gap-4">
      <Wrapper className="my-6 xl:my-6 px-4 md:px-8">
        <div className="sm:bg-background/80 sm:backdrop-blur-2xl sm:border px-0 md:px-6 rounded-xl">
          <p className="pb-4 md:py-6 text-initial text-sm md:text-base font-bold border-b">
            [ List of all agreements by {truncate(credentials?.address)} ]
          </p>

          {isFetchingAgreements ? (
            <div className="py-4 md:py-6">
              <p className="font-semibold md:font-normal text-xs md:text-sm">
                Loading agreements...
              </p>
            </div>
          ) : allAgreements && allAgreements?.length === 0 ? (
            <div className="py-4 md:py-6">
              <p className="font-semibold md:font-normal text-xs md:text-sm">
                No agreements found, you need to initiate an agreement.
              </p>
            </div>
          ) : (
            allAgreements?.map((agr: any) => (
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
                    {truncate(`${agr.initiator}`)}{" "}
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
                    {truncate(`${agr.buyer}`)}{" "}
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
                    {agr.validSigners.map((signer: string, _key: number) => (
                      <p
                        className="flex-1 font-medium flex items-center gap-3 text-xs md:text-sm text-muted-foreground"
                        key={_key + 1}>
                        {signer}
                      </p>
                    ))}
                  </div>
                </div>
                {!agr.signed ? (
                  <Button
                    onClick={() => handleSignAgreement(agr)}
                    disabled={isFetchingAgreements || isSigningAgreement}>
                    {isSigningAgreement ? (
                      <>
                        <Loader className="size-4 mr-2 animate-spin" /> Please
                        wait...
                      </>
                    ) : (
                      "Sign Agreement"
                    )}
                  </Button>
                ) : null}

                {agr.executed ? <h2>Executed</h2> : null}
              </div>
            ))
          )}
        </div>
      </Wrapper>
    </div>
  );
}
