import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex-1 py-4 flex flex-col gap-6">
      <h1 className="text-xl font-bold">Find your dream home</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, _key) => (
          <Link
            href={`/dashboard/estate/${_key + 1}`}
            key={_key}
            className="w-full flex flex-col">
            <div className="bg-background aspect-[1.4] rounded-3xl"></div>
            <div className="mt-3 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-base md:text-lg font-bold truncate">
                  Roselands House
                </h1>
                <p className="text-lg font-bold text-primary">$3000</p>
              </div>
              <p className="flex-1 line-clamp-2 text-sm md:text-base font-medium">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim
                sint qui quod, placeat asperiores rerum assumenda laudantium
                dignissimos dolorem necessitatibus sunt obcaecati? Culpa eius
                nesciunt accusamus dolor atque esse ipsum.
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
