import React from "react";
import MaxWrapper from "@/components/shared/max-wrapper";
import { site, states } from "@/constants";
import Link from "next/link";
import Logo from "@/components/shared/logo";

export default function Footer() {
  return (
    <footer className="w-full py-10 md:py-16 border-t bg-secondary/20 px-4">
      <div className="max-w-[1160px] w-full mx-auto">
        <div className="flex flex-col pb-6 md:pb-10 mb-10">
          <h3 className="text-sm md:text-base uppercase font-medium">
            Find top real estate agents in all major US cities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {states.slice(0, 16).map((state) => (
              <Link
                key={state}
                href={`/${state.toLowerCase()}/top-real-estate-agent`}
                className="text-sm font-normal text-muted-foreground hover:text-foreground">
                {state}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t w-full pt-10 flex flex-col items-center text-center">
          <Logo />
          <p className="text-xs max-w-[800px] w-full text-muted-foreground mt-2 mb-4">
            Our Commitment to Accessibility: {site.name} is committed to making
            our website accessible and user friendly to all. While we are
            constantly working to improve, we welcome your feedback and
            accommodation requests. If you are having difficulty accessing or
            navigating our website, or if you have any suggestions to improve
            accessibility, please email our team or contact us.
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            {site.name}, Inc. is a licensed real estate broker in the State of
            Nigeria, DRE license # 01900940.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mt-4">
            Terms of Service | Privacy Policy
          </p>
          <p className="text-sm md:text-base text-muted-foreground">
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
