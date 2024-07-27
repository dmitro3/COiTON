"use client";

import { useAuth } from "@/providers/authprovider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: ILayout) {
  const router = useRouter();

  const { credentials, isFetchingUser } = useAuth();

  useEffect(() => {
    if (!isFetchingUser && credentials) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="flex-1 h-dvh w-full flex">
      <div className="hidden lg:flex lg:max-w-lg lg:w-full bg-background/80 backdrop-blur-2xl border-r"></div>

      <div className="flex items-center justify-center mx-auto max-w-md flex-1 px-4">
        {children}
      </div>
    </div>
  );
}
