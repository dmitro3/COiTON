"use client";

import Slider from "react-slick";
import MaxWrapper from "../shared/wrapper";
import { Button } from "../ui/button";
import TestimonialCard from "../card/TestimonialCard";
// @ts-ignore
import Masonry from "react-responsive-masonry";

export default function TestimonialSection() {
  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 20000,
  //   slidesToShow: 3,
  //   slidesToScroll: 2,
  //   initialSlide: 1,
  //   autoplay: true,
  //   autoplaySpeed: 20000,
  //   cssEase: "linear",
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 2,
  //         slidesToScroll: 1,
  //         infinite: true,
  //         dots: true,
  //       },
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 1,
  //         slidesToScroll: 1,
  //         initialSlide: 2,
  //       },
  //     },
  //   ],
  // };

  return (
    <div className="bg-secondary/20 mt-16 md:mt-32 py-16 md:py-32 w-full">
      <MaxWrapper className="flex w-full gap-10 flex-col ">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            14k+ People has found <br /> their home with us
          </h1>

          <Button variant="secondary">See All Testimonial</Button>
        </div>

        <Masonry columnsCount={3} gutter="10px" className="flex flex-wrap">
          {Array.from({ length: 3 }).map((_, _key) => (
            <TestimonialCard key={_key} />
          ))}
        </Masonry>
      </MaxWrapper>
    </div>
  );
}

// <Slider {...settings} className="flex gap-5 px-4">
//   {Array.from({ length: 20 }).map((_, _key) => (
//     <TestimonialCard key={_key} />
//   ))}
// </Slider>
