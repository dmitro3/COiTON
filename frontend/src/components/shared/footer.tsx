import Link from "next/link";
import MaxWrapper2 from "./max-wrapper";
import Image from "next/image";
import { Button } from "../ui/button";

import { FaApple } from "react-icons/fa";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { BiLogoLinkedin } from "react-icons/bi";
import { Input } from "../ui/input";

export default function Footer() {
  return (
    <div className="bg-primary w-full text-secondary mt-20">
      <MaxWrapper2 className="flex flex-col">
        <div className="flex gap-10 lg:gap-20 py-10 flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-[440px] gap-2">
            <Link href="/" className="w-max -ml-2">
              <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={100}
                priority
                quality={100}
              />
            </Link>

            <div className="flex items-center justify-between gap-4 flex-1">
              <div className="flex flex-col gap-0.5 max-w-max w-max lg:max-w-[204px] lg:w-full">
                <p className="text-sm md:text-base font-normal opacity-80">
                  Total Free Customer Care
                </p>
                <p className="font-bold text-base">+(234) 123 456 789</p>
              </div>
              <div className="flex flex-col gap-0.5 max-w-max w-max lg:max-w-[204px] lg:w-full">
                <p className="text-sm md:text-base font-normal opacity-80">
                  Live Support?
                </p>
                <p className="font-bold text-base">help@gmail.com</p>
              </div>
            </div>

            <div className="my-6 flex flex-col gap-2">
              <p className="font-bold text-base">Apps</p>

              <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-4 bg-background/10 rounded-xl py-2 px-4 max-w-full sm:max-w-[204px] w-full cursor-pointer">
                  <FaApple className="w-8 h-8" />
                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium opacity-80 -mb-1">
                      Download on the
                    </p>
                    <p className="font-bold text-base">Apple Store</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-background/10 rounded-xl py-2 px-4 max-w-full sm:max-w-[204px] w-full cursor-pointer">
                  <IoLogoGooglePlaystore className="w-8 h-8" />
                  <div className="flex flex-col">
                    <p className="text-sm md:text-base font-medium opacity-80 -mb-1">
                      Get it on
                    </p>
                    <p className="font-bold text-base">Google Play</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-bold text-base">Follow us on social media</p>

              <div className="flex items-center gap-6">
                <FaFacebookF className="w-4 h-4" />
                <FaXTwitter className="w-4 h-4" />
                <FaInstagram className="w-4 h-4" />
                <BiLogoLinkedin className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 pt-6">
            <p className="font-bold text-base">Keep Yourself Up To Date</p>
            <div className="w-full rounded-lg bg-background/10 px-4 h-16 mt-4 pr-6 mb-6 flex items-center gap-2">
              <Input
                className="w-full h-full shadow-none border-none text-secondary placeholder:text-secondary/80 text-base font-medium"
                placeholder="Enter your email"
                type="email"
              />
              <p className="font-bold text-base">Subscribe</p>
            </div>

            <div className="flex gap-6 flex-col md:flex-row justify-between">
              <div className="flex flex-col gap-4">
                <p className="font-bold text-base">Popular Search</p>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Apartment for Sale
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Office for Sale
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-bold text-base">Quicl Links</p>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Terms of Use
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Privacy Policy
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    FAQs
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-bold text-base">Discovery</p>

                <div className="flex flex-col gap-2">
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Nigeria
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Chicago
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    Los Angeles
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    New Jersey
                  </p>
                  <p className="font-semibold opacity-80 text-sm sm:text-base">
                    New York
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <p>© 2022. All rights reserved</p>
          <div className="flex items-center gap-2">
            <p>Privacy</p>
            <p>Terms</p>
            <p>Sitemap</p>
          </div>
        </div>
      </MaxWrapper2>
    </div>
  );
}
