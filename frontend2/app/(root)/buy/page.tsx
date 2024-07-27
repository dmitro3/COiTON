import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { RiSearch2Line } from "react-icons/ri";

export default function BuyPage() {
  return (
    <div className="flex-1 w-full">
      <Wrapper className="my-16 md:my-20">
        <div className="flex items-center flex-col text-center max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
            Your Journey to Homeownership Starts Here
          </h1>

          <p className="max-w-2xl my-6 text-base md:text-lg">
            Find your ideal investment and unlock a lifestyle you deserve with
            our diverse real estate offerings.
          </p>

          <div className="w-full h-14 max-w-2xl mx-auto bg-background/50 rounded-full">
            <div className="size-full flex items-center backdrop-blur-2xl border rounded-full pl-4">
              <RiSearch2Line size={22} className="text-muted-foreground/80" />
              <Input
                className="h-full flex-1 bg-transparent text-base border-0 pl-3 pr-6"
                placeholder="Search properties..."
              />
            </div>
          </div>
        </div>
      </Wrapper>

      <Wrapper className="mb-16 md:mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, _key) => (
          <div
            key={_key}
            className="w-full bg-transparent backdrop-blur-xl aspect-square border rounded-xl relative overflow-hidden">
            <Image
              src="/img/banner.avif"
              alt="image"
              width={2970}
              height={1980}
              priority
              quality={100}
              className="size-full object-cover"
            />
            <div className="absolute top-0 left-0 z-10 bg-gradient-to-b from-transparent via-background/50 to-background/80 size-full flex flex-col justify-end py-3 px-4">
              <p>64 Oak Avenue, Sunnyvale, CA</p>
            </div>
            {/* <div className="absolute top-0 right-0 border border-t-0 border-r-0 bg-background max-w-[250px] w-full aspect-video rounded-bl-xl z-10">
              <div className="border-b w-full px-3 py-2 text-base md:text-lg font-semibold">
                $106,000
              </div>

              <div className="flex flex-col gap-2 py-2 px-3">
                <p className="text-sm text-muted-foreground">
                  Beds: 4 | Baths: 5 | 2,800 sq ft 64 Oak Avenue, Sunnyvale, CA
                </p>

                <Button
                  className="w-full rounded-full"
                  size={"sm"}
                  variant={"secondary"}>
                  Buy
                </Button>
              </div>
            </div> */}
          </div>
        ))}
      </Wrapper>
    </div>
  );
}
