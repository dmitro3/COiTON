import React from "react";
import { Button } from "../ui/button";

export default function Heading({
  subtitle,
  title,
  button,
}: {
  subtitle: string;
  title: string;
  button?: boolean;
}) {
  return (
    <div className="flex items-end justify-between">
      <div className="flex flex-col sm:gap-2">
        <p className="text-primary text-sm md:text-base uppercase font-bold flex items-center gap-2">
          <span className="w-4 sm:w-8 h-1 bg-primary rounded-3xl" />
          {subtitle}
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
          {title}
        </h1>
      </div>

      {button && <Button>View more</Button>}
    </div>
  );
}
