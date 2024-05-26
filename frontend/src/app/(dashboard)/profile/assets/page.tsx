import React from "react";

export default function AssetsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 10 }).map((_, _key) => (
        <div
          key={_key}
          className="w-full rounded-xl bg-secondary aspect-[1.4]"></div>
      ))}
    </div>
  );
}
