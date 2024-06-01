"use client";

import LoadingComponent from "@/components/shared/loader";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/constants";
import { useAuth } from "@/context/authContext";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { credentials, isFetchingUser } = useAuth();

  useEffect(() => {
    if (!isFetchingUser && credentials) {
      router.push("/dashboard");
    }
  }, [credentials, isFetchingUser, router]);

  if (isFetchingUser)
    return <LoadingComponent text="Authenticating, please wait..." />;

  return (
    <div className="flex h-screen">
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
      <div className="flex justify-center items-center h-full py-10 px-4 w-full max-w-full lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl relative">
        <Link
          href="/"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "w-max h-12 absolute top-4 md:top-6 left-4 md:left-6",
          })}>
          <MoveLeft className="w-4 h-4 mr-2" />
          Go Back
        </Link>
        {children}
      </div>
    </div>
  );
}
