import MaxWrapper from "@/components/shared/max-wrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const littleDetails = [
  {
    number: "10+",
    text: "Years of experience",
  },
  {
    number: "1200+",
    text: "Happy Customers",
  },
  {
    number: "928+",
    text: "Projects done",
  },
  {
    number: "92+",
    text: "Partnership",
  },
];

export default function Banner() {
  return (
    <MaxWrapper className="pt-10 md:pt-16 pb-10 md:pb-16 lg:pb-32 flex flex-col">
      <div className="flex items-center justify-center flex-col text-center mx-auto max-w-[1160px] w-full pt-3 md:py-6 lg:py-10">
        <h1 className="font-medium text-3xl sm:text-4xl md:text-5xl 2xl:text-6xl max-w-full md:max-w-2xl w-full">
          Elevate Designing <br /> Spaces, Shaping Dreams
        </h1>
        <p className="text-sm md:text-base lg:text-lg mt-4 md:mt-6">
          Crafting Innovative Designs, Shaping Inspirations for Sustainable
          Living in Tomorrow&apos;s World <br /> Timeless Designs, Shaping
          Inspriations for Tomorrow&apos;s World
        </p>

        <div className="flex items-center justify-center mt-8 md:mt-10 gap-2 lg:gap-4 w-full flex-col lg:flex-row max-w-md">
          <Link
            href="/dashboard"
            className={buttonVariants({
              className: "w-full lg:w-max round h-12 font-medium",
              size: "lg",
            })}>
            Buy a house
          </Link>
          <Link
            href="/new"
            className={buttonVariants({
              className: "w-full lg:w-max round h-12 font-medium",
              size: "lg",
              variant: "outline",
            })}>
            Sell your house
          </Link>
        </div>
      </div>

      <div className="bg-secondary rounded-lg md:rounded-3xl lg:rounded-[30px] p-1 w-full my-16 md:my-20 border relative shadow-md">
        <div className="absolute -bottom-2 md:-bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-5%)] h-full bg-secondary rounded-lg md:rounded-3xl lg:rounded-[30px] -z-10 shadow-md"></div>
        <div className="absolute -bottom-4 md:-bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-10%)] h-full bg-secondary rounded-lg md:rounded-3xl lg:rounded-[30px] -z-20 opacity-60"></div>
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

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10 md:mt-20">
        {littleDetails.map((ld, id) => (
          <div className="flex flex-col items-center text-center" key={id}>
            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
              {ld.number}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              {ld.text}
            </p>
          </div>
        ))}
      </div>
    </MaxWrapper>
  );
}
