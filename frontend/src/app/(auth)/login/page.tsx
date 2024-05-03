"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// @ts-ignore
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaGithub } from "react-icons/fa6";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useEffect, useState } from "react";
import { cn, shortenAddress } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { loginUser } from "@/auth";
import { loginSchema } from "@/validations";
import { toast } from "sonner";
import { Loader2, Wallet2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const [isLoading, setIsLoading] = useState(false);
  const [isAddress, setIsAddress] = useState("");
  const [isError, setIsError] = useState("");

  useEffect(() => {
    if (isConnected) {
      setIsAddress(`${address}`);
    }
  }, [address, isConnected, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (!isConnected) return setIsError("You need to connect your wallet");

    const formData = {
      email: values.email,
      password: values.password,
    };

    try {
      setIsLoading(true);
      const { data, error }: any = await loginUser(formData);

      if (error) {
        toast.error("Something went wrong", {
          description: error?.message,
        });
        setIsLoading(false);
      } else {
        toast.success(`Welcome back ${data?.user?.user_metadata?.name}`, {
          description: "You are being redirected to the dashboard",
        });
        router.push("/dashboard");
        form.reset();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-end gap-6 h-full">
      <Link
        href="/"
        className={buttonVariants({
          variant: "ghost",
          size: "sm",
          className: "w-max",
        })}>
        Go Back
      </Link>

      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-[350px] flex flex-col items-center">
          <Image
            src="/img/logo.png"
            alt="home"
            width={90}
            height={90}
            priority
            className="mb-10"
          />

          <h1 className="text-xl md:text-2xl font-bold">Login to continue</h1>
          <p className="text-sm mt-1 mb-4 text-muted-foreground">
            Enter your email below to use UrbanExchange
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="name@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="**********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Please
                      wait...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>

              <p className="text-xs flex items-center gap-2 my-6 text-muted-foreground">
                <span className="flex-1 h-[1px] bg-secondary" />
                CONNECT YOUR WALLET TO CONTINUE
                <span className="flex-1 h-[1px] bg-secondary" />
              </p>

              <Button
                onClick={() => {
                  if (isConnected) {
                    disconnect();
                  } else {
                    open({ view: "Connect" });
                  }
                }}
                disabled={!!isAddress}
                type="button"
                className="w-full mb-4"
                variant="secondary">
                {!isAddress ? (
                  <>
                    Connect Wallet
                    <Wallet2 className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  shortenAddress(isAddress)
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Create One
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
