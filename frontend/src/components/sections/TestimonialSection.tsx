"use client";

import MaxWrapper from "../shared/wrapper";
import { Button } from "../ui/button";
import TestimonialCard from "../card/TestimonialCard";

export default function TestimonialSection() {
  return (
    <div className="bg-secondary/20 mt-16 md:mt-32 py-16 md:py-32 w-full">
      <MaxWrapper className="flex w-full gap-10 flex-col ">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            14k+ People has found <br /> their home with us
          </h1>

          <Button variant="secondary">See All Testimonial</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 3 }).map((_, _key) => (
            <TestimonialCard key={_key} />
          ))}
        </div>
      </MaxWrapper>
    </div>
  );
}
