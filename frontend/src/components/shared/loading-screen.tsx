import { Loader2 } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex-1 w-full h-screen flex items-center justify-center">
      <Image
        src="/logo.svg"
        alt="logo"
        width={100}
        height={100}
        className="object-cover animate-pulse"
      />
    </div>
  );
}
