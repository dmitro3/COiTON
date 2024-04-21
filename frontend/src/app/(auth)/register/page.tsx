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
import { useContext, useEffect, useState } from "react";
import { cn, shortenAddress } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/authentication";

const formSchema = z.object({
  email: z.string().min(2).max(50),
});

export default function RegisterPage() {
  const router = useRouter();

  const { registerUser, isLoading, user } = useContext(AuthContext);
  const { address, isConnected } = useWeb3ModalAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const [isAddress, setIsAddress] = useState("");
  const [isError, setIsError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }

    if (isConnected) {
      setIsAddress(`0x${address}`);
    }
  }, [address, isConnected, router, user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      email: values.email,
      address: isAddress,
    };

    if (isConnected) {
      registerUser(data);
    } else {
      setIsError("You need to connect your wallet");
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-end gap-6 h-full">
      <div className="flex justify-end">
        <Link
          href="/login"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "w-max",
          })}>
          Login
        </Link>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full max-w-[350px] flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold">Create an account</h1>
          <p className="text-sm mt-1 mb-4 text-muted-foreground">
            Enter your email below to create your account
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
                <div className="flex flex-col w-full gap-1">
                  {!isConnected && (
                    <p
                      onClick={() => {
                        if (isConnected) {
                          disconnect();
                        } else {
                          open({ view: "Connect" });
                        }
                      }}
                      className="bg-secondary rounded-md px-2 py-1 text-xs cursor-pointer w-max flex justify-end">
                      Connect Wallet
                    </p>
                  )}

                  <p
                    className={cn(
                      "flex items-center rounded-md border w-full text-[14px] h-9 px-4 text-muted-foreground",
                      {
                        "cursor-not-allowed opacity-70 select-none": isLoading,
                      }
                    )}>
                    {isConnected
                      ? shortenAddress(isAddress)
                      : "Wallet not connected"}
                  </p>
                  {!isAddress && isError && (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {isError}
                    </p>
                  )}
                </div>
                <Button disabled={isLoading} type="submit" className="w-full">
                  {isLoading ? "Processing..." : "Register"}
                </Button>
              </div>

              <p className="text-xs flex items-center gap-2 my-6 text-muted-foreground">
                <span className="flex-1 h-[1px] bg-secondary" />
                OR CONTINUE WITH
                <span className="flex-1 h-[1px] bg-secondary" />
              </p>

              <Button
                disabled
                type="submit"
                className="w-full mb-4"
                variant="outline">
                <FaGithub className="w-4 h-4 mr-2" /> Github
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                By clicking continue, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
