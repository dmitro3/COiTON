"use client";

import { buttonVariants } from "@/components/ui/button";
import { useAuthContext } from "@/providers/authcontext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { getUser } = useAuthContext();

  const fetchUser = async () => {
    const { data, error }: any = await getUser();

    if (!error || data?.user) return router.replace("/dashboard");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex h-svh">
      <div className="h-full flex-1 bg-secondary/20 hidden lg:flex p-4 md:p-6 lg:p-8 xl:p-10 border-r relative overflow-hidden">
        <div className="absolute bg-secondary w-full h-full top-0 left-0">
          <Image
            src="/img/test.png"
            alt=""
            width={3456}
            height={6912}
            priority
            className="object-cover w-full brightness-75"
          />
        </div>
      </div>
      <div className="flex justify-center items-center h-svh py-10 px-4 w-full max-w-full lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl relative">
        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            className: "w-max h-12 absolute top-4 md:top-6 left-4 md:left-6",
          })}>
          Go Back
        </Link>
        {children}
      </div>
    </div>
  );
}
