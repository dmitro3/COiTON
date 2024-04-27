"use client";

import { useEffect, useState } from "react";

export default function ProgressLoader() {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 w-full h-[3px] z-50 bg-secondary">
      <div
        className={`h-full bg-primary w-[${progress}%] transition-all`}></div>
    </div>
  );
}
