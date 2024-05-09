"use client";

import { shortenAddress } from "@/lib/utils";
import { Copy } from "lucide-react";

export default function AgreementsPage() {
  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">Agreements</h1>

      <div className="my-2">
        <div className="bg-transparent md:bg-secondary/20 md:border px-0 md:px-6 rounded-xl">
          <p className="pb-8 md:py-6 text-primary font-bold border-b">
            [ This is a complete list of your agreements ]
          </p>

          {Array.from({ length: 5 }).map((_, _key) => (
            <div
              className="py-4 md:py-6 flex flex-col gap-4 border-b last:border-b-0"
              key={_key}>
              <div className="flex items-start md:items-center flex-col md:flex-row">
                <div className="max-w-[250px] w-full">
                  <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                    Estate ID:
                  </p>
                </div>

                <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-sm md:text-base text-muted-foreground md:text-foreground">
                  5541
                </p>
              </div>
              <div className="flex items-start md:items-center flex-col md:flex-row">
                <div className="max-w-[250px] w-full">
                  <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                    From:
                  </p>
                </div>

                <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-sm md:text-base text-muted-foreground md:text-foreground">
                  {shortenAddress("0x610178dA211FEF7D417bC0e6FeD39F05609AD788")}{" "}
                  <Copy className="w-4 h-4 cursor-pointer" />
                </p>
              </div>
              <div className="flex items-start md:items-center flex-col md:flex-row">
                <div className="max-w-[250px] w-full">
                  <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                    To:
                  </p>
                </div>

                <p className="flex-1 font-normal md:font-medium flex items-center gap-3 text-sm md:text-base text-muted-foreground md:text-foreground">
                  {shortenAddress("0x610178dA211FEF7D417bC0e6FeD39F05609AD788")}{" "}
                  <Copy className="w-4 h-4 cursor-pointer" />
                </p>
              </div>
              <div className="flex items-start md:items-center flex-col md:flex-row">
                <div className="max-w-[250px] w-full">
                  <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                    Number of Signers:
                  </p>
                </div>

                <p className="flex-1 font-bold flex items-center gap-3 text-sm md:text-base text-primary">
                  16
                </p>
              </div>
              <div className="flex items-start flex-col md:flex-row">
                <div className="max-w-[250px] w-full">
                  <p className="text-foreground font-semibold md:font-normal md:text-muted-foreground text-base">
                    All Signers:
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {Array.from({ length: 2 }).map((_, _key) => (
                    <p
                      className="flex-1 font-bold flex items-center gap-3 text-sm md:text-base text-primary"
                      key={_key}>
                      0x610178dA211FEF7D417bC0e6FeD39F05609AD788
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
