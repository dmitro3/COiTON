import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { dummyProperties } from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GrMapLocation } from "react-icons/gr";
import { LiaEthereum, LiaMapMarkedAltSolid } from "react-icons/lia";
import { PiBuildingOfficeLight } from "react-icons/pi";
import { RxClock } from "react-icons/rx";
import { MdOutlineArrowForward } from "react-icons/md";

const littleDetails = [
  {
    number: "10",
    text: "Years of experience",
  },
  {
    number: "100",
    text: "Happy Customers",
  },
  {
    number: "3",
    text: "Partnership",
  },
];

export default function HomePage() {
  return (
    <div className="flex-1 w-full">
      <Wrapper className="my-16 md:my-20 max-w-screen-lg 2xl:max-w-screen-xl">
        <h1 className="md:max-w-5xl text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
          {siteConfig.slogan}
        </h1>

        <p className="text-sm sm:text-base max-w-4xl my-6 md:my-8">
          {siteConfig.description}
        </p>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 4 }).map((_, _key) => (
                <div
                  key={_key}
                  className="size-11 sm:size-12 rounded-full bg-secondary first:ml-0 -ml-5 border-2 border-background"></div>
              ))}
            </div>

            <div className="flex flex-col">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Trusted by over 500+
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                business owners
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm md:text-base md:max-w-2xl lg:text-right">
            Crafting Innovative Designs, Shaping Inspirations for Sustainable
            Living <br className="hidden md:inline-flex" /> in Tomorrow&apos;s
            World Timeless Designs, Shaping Inspirations for Tomorrow&apos;s
            World
          </p>
        </div>
      </Wrapper>

      <Wrapper className="my-16 md:my-20">
        <div className="bg-background rounded-lg md:rounded-3xl lg:rounded-[30px] p-1 w-full border relative shadow-md">
          <div className="w-full h-max rounded-md md:rounded-2xl lg:rounded-[26px] bg-background overflow-hidden">
            <Image
              src="/img/banner.png"
              alt=""
              width={3360}
              height={1926}
              priority
              quality={100}
              className="w-full h-full object-contain rounded-md md:rounded-2xl lg:rounded-[26px]"
            />
          </div>
        </div>
      </Wrapper>

      <Wrapper className="my-20 md:my-28 max-w-screen-lg 2xl:max-w-screen-xl">
        <div className="bg-background/80 backdrop-blur-2xl rounded-3xl p-6 md:p-8 w-full flex flex-col md:flex-row gap-6 justify-between border">
          <div className="flex flex-col">
            <h3 className="text-lg md:text-xl font-medium">
              Trusted by over 500+
            </h3>
            <h3 className="text-lg md:text-xl font-medium">business owners</h3>

            <Button
              variant={"outline"}
              className="rounded-full w-full sm:w-max bg-transparent hover:bg-transparent mt-auto">
              Explore More About Us
            </Button>
          </div>

          <div className="bg-secondary/50 rounded-2xl py-3 md:py-6 px-4 md:px-8 flex items-center justify-between gap-8 md:max-w-xl w-full border">
            {littleDetails.map((ld, id) => (
              <div className="flex flex-col text-center" key={id}>
                <h1 className="font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  {ld.number}+
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {ld.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>

      <Wrapper className="my-20 md:my-28 max-w-screen-lg 2xl:max-w-screen-xl">
        <h1 className="max-w-5xl text-xl md:text-2xl lg:text-4xl font-bold">
          Featured Property
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Below are a list of some of our featured properties, check them out
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-10">
          <div className="bg-background/80 backdrop-blur-2xl rounded-3xl border w-full aspect-square md:aspect-[1.6] relative group overflow-hidden">
            <Image
              src={dummyProperties[0].image[0]}
              alt={dummyProperties[0].title}
              fill
              priority
              className="size-full object-cover"
            />
            <div className="absolute top-0 left-0 size-full bg-gradient-to-b from-transparent to-background/60 z-10" />
            <div className="absolute bottom-6 opacity-100 pointer-events-auto duration-300 transition-all left-1/2 -translate-x-1/2 w-[calc(100%-10%)] bg-background/80 backdrop-blur-2xl px-6 py-4 border rounded-xl flex items-end justify-between gap-6 z-10">
              <div className="flex flex-col flex-1 gap-1">
                <h3 className="text-base md:text-lg lg:text-xl font-medium line-clamp-1">
                  {dummyProperties[0].title}
                </h3>
                <p className="flex items-center text-sm text-muted-foreground truncate">
                  <GrMapLocation size={16} className="mr-2" />
                  <span>{dummyProperties[0].address}</span>
                </p>
              </div>

              <p className="text-sm text-muted-foreground hover:underline hover:text-primary transition cursor-pointer">
                View Property
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {dummyProperties.slice(1, 3).map((ppt, _key) => (
              <div
                key={_key}
                className="bg-background/80 backdrop-blur-2xl rounded-3xl border w-full aspect-square md:aspect-[2] relative group overflow-hidden">
                <Image
                  src={ppt.image[0]}
                  alt={ppt.title}
                  fill
                  priority
                  className="size-full object-cover"
                />
                <div className="absolute top-0 left-0 size-full bg-gradient-to-b from-transparent to-background/60 z-10" />
                <div className="absolute bottom-6 opacity-100 pointer-events-auto duration-300 transition-all left-1/2 -translate-x-1/2 w-[calc(100%-10%)] bg-background/80 backdrop-blur-2xl px-6 py-4 border rounded-xl flex items-end justify-between gap-6 z-10">
                  <div className="flex flex-col flex-1 gap-1">
                    <h3 className="text-base md:text-lg lg:text-xl font-medium line-clamp-1">
                      {ppt.title}
                    </h3>
                    <p className="flex items-center text-sm text-muted-foreground truncate">
                      <LiaMapMarkedAltSolid size={16} className="mr-2" />
                      <span>{ppt.address}</span>
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground hover:underline hover:text-primary transition cursor-pointer">
                    View Property
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>

      <Wrapper className="my-20 md:my-28 max-w-screen-lg 2xl:max-w-screen-xl">
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <h1 className="max-w-5xl text-xl md:text-2xl lg:text-4xl font-bold">
              Latest properties
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Below are a list of some of our featured properties, check them
              out
            </p>
          </div>

          <Button className="rounded-full" asChild>
            <Link href="/dashboard" className="flex items-center">
              View more <ArrowRight size={16} className="ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6 md:mt-10">
          {dummyProperties.slice(0, 4).map((property, _key) => (
            <div key={_key} className="flex flex-col group">
              <div
                // href={`/listing/${property?.id}`}
                className="relative bg-background/60 backdrop-blur-3xl rounded-2xl w-full aspect-square md:h-[308px] border">
                <div className="bg-background/80 backdrop-blur-xl rounded-[inherit] w-full h-full group-hover:h-[30%] absolute bottom-0 left-0 z-10 border-t transition-all duration-500 overflow-hidden">
                  <Image
                    src={property?.image[0]}
                    alt={property?.title}
                    fill
                    priority
                    className="size-full object-cover group-hover:scale-110 duration-300 delay-200"
                  />

                  <div className="size-full absolute top-0 left-0 bg-gradient-to-b from-transparent to-background/70" />
                </div>

                <div className="size-full rounded-2xl p-4 flex flex-col gap-2 pt-8 opacity-0 group-hover:pt-4 group-hover:opacity-100 transition-all delay-300">
                  <p className="text-base sm:text-lg md:text-xl text-primary font-medium flex items-center">
                    <LiaEthereum className="mr-1 size-4 sm:size-5" />
                    {property?.price.toLocaleString()}
                  </p>

                  <p className="flex items-center text-xs sm:text-sm text-muted-foreground">
                    <span className="line-clamp-1 flex-1">
                      {property?.address}
                    </span>
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <p className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <RxClock size={16} className="mr-1.5" />
                      {property?.createdAt}
                    </p>
                    <p className="flex items-center text-xs sm:text-sm text-muted-foreground">
                      <PiBuildingOfficeLight size={16} className="mr-1.5" />
                      {property?.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-1">
                <p className="text-sm sm:text-base line-clamp-2 flex-1 font-medium mb-2 flex items-center">
                  {property?.title}{" "}
                  <MdOutlineArrowForward className="ml-2 size-4 group-hover:-rotate-45 transition-all duration-300" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}
