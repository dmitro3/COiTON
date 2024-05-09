import Link from "next/link";
import Image from "next/image";

import { FaApple } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { BiLogoLinkedin } from "react-icons/bi";
import { Input } from "../ui/input";
import MaxWrapper2 from "./max-wrapper";

export default function Footer() {
  return (
    <div className="bg-secondary/30 w-full text-foreground pt-20 pb-10 relative">
      <MaxWrapper2 className="flex flex-col z-10">
        <div className="flex gap-10 lg:gap-20 pb-10 flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-[450px] gap-2">
            <Link href="/" className="w-max -ml-2">
              <Image
                src="/img/logo.png"
                alt="logo"
                width={40}
                height={40}
                priority
                quality={100}
                className="w-10 h-10"
              />
            </Link>

            <div className="flex items-center justify-between gap-4 flex-1">
              <div className="flex flex-col gap-0.5 max-w-max w-max lg:max-w-[204px] lg:w-full">
                <p className="text-xs md:text-sm font-normal text-muted-foreground">
                  Total Free Customer Care
                </p>
                <p className="font-bold text-xs md:text-sm">
                  +(234) 123 456 789
                </p>
              </div>
              <div className="flex flex-col gap-0.5 max-w-max w-max lg:max-w-[204px] lg:w-full">
                <p className="text-xs md:text-sm font-normal text-muted-foreground">
                  Live Support?
                </p>
                <p className="font-bold text-xs md:text-sm">help@gmail.com</p>
              </div>
            </div>

            <div className="mb-6 mt-4 flex flex-col gap-2">
              <p className="font-bold text-sm">Apps</p>

              <div className="flex items-center justify-between flex-col sm:flex-row gap-4 md:gap-6">
                <div className="flex items-center gap-4 bg-background rounded-xl py-3 px-4 w-full cursor-pointer">
                  <FaApple className="w-9 h-9" />

                  <p className="text-xs font-medium text-muted-foreground">
                    Download on the{" "}
                    <span className="font-bold text-sm">Apple Store</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 bg-background rounded-xl py-3 px-4 w-full cursor-pointer">
                  <IoLogoGooglePlaystore className="w-9 h-9" />

                  <p className="text-xs md:text-sm font-medium text-muted-foreground">
                    Get on the{" "}
                    <span className="font-bold text-sm">Google Play</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold text-sm">Follow us on social media</p>

              <div className="flex items-center gap-6">
                <FaFacebookF className="w-4 h-4" />
                <FaXTwitter className="w-4 h-4" />
                <FaInstagram className="w-4 h-4" />
                <BiLogoLinkedin className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 pt-6">
            <p className="font-bold text-sm">Keep Yourself Up To Date</p>
            <div className="w-full rounded-lg bg-background/10 px-4 h-14 mt-4 pr-6 mb-6 flex items-center gap-2 border">
              <Input
                className="w-full h-full shadow-none border-none text-sm font-medium"
                placeholder="Enter your email"
                type="email"
                disabled
              />
              <p className="font-bold text-sm">Subscribe</p>
            </div>

            <div className="flex gap-6 flex-col md:flex-row justify-between">
              <div className="flex flex-col gap-4">
                <p className="font-bold text-sm">Popular Search</p>

                <div className="flex flex-col gap-2">
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Apartment for Sale
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Office for Sale
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-bold text-sm">Quicl Links</p>

                <div className="flex flex-col gap-2">
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Terms of Use
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Privacy Policy
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    FAQs
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-bold text-sm">Discovery</p>

                <div className="flex flex-col gap-2">
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Nigeria
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Chicago
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    Los Angeles
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    New Jersey
                  </p>
                  <p className="font-normal text-muted-foreground text-xs sm:text-sm">
                    New York
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2022. All rights reserved
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs md:text-sm text-muted-foreground">Privacy</p>
            <p className="text-xs md:text-sm text-muted-foreground">Terms</p>
            <p className="text-xs md:text-sm text-muted-foreground">Sitemap</p>
          </div>
        </div>
      </MaxWrapper2>
      <Image
        src="/svg/home.svg"
        alt="home"
        width={700}
        height={700}
        quality={100}
        priority
        className="absolute -bottom-0 left-0 select-none pointer-events-none"
      />
    </div>
  );
}
