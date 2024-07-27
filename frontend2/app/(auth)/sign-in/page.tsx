"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { truncate } from "@/lib/utils";
import { useAuth } from "@/providers/authprovider";
import { Cross2Icon } from "@radix-ui/react-icons";
import { CircleCheckBig, Loader } from "lucide-react";
import { signInSchema } from "@/lib/validators";
import { IoMailOutline } from "react-icons/io5";
import { GoShieldLock } from "react-icons/go";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimate,
  usePresence,
} from "framer-motion";
import { useFetch } from "@/hooks/useFetch";
import { signIn } from "@/utils/db/apiAuth";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const getIconFromStatus = (
  status: "authenticated" | "loading" | "unauthenticated"
) => {
  switch (status) {
    case "authenticated":
      return (
        <div className="flex items-center text-sm">
          <CircleCheckBig className="size-4 text-green-500 mr-2" />{" "}
          Authenticated
        </div>
      );
    case "loading":
      return (
        <div className="flex items-center text-sm">
          <Loader className="animate-spin size-4 mr-2" /> Verifying...
        </div>
      );
    case "unauthenticated":
      return (
        <div className="flex items-center text-sm">
          <Cross2Icon className="text-red-500 size-4 mr-2" /> Unauthenticated
        </div>
      );
    default:
      return "❓";
  }
};

export default function SignInPage() {
  const router = useRouter();

  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const {
    isConnected,
    isConnecting,
    address,
    chainId,
    accountStatus,
    openWallet,
  } = useAuth();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      address: `${address}` || "",
    },
  });

  useEffect(() => {
    form.setValue("address", `${address}`);
  }, [address]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    toast.loading(`Authenticating "${values.email}"`);
    try {
      setIsSigningIn(true);
      const result = await signIn(values);
      if (result) {
        toast.success(`Welcome back "${values?.email}" 🎉`);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log("Error signing in:", error);
    } finally {
      toast.dismiss();
      setIsSigningIn(false);
    }
  }

  return (
    <motion.div className="w-full flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome Back</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Login with your credentials to continue
            </p>
          </div>

          <div className="flex flex-col gap-2 my-6">
            <FormField
              control={form.control}
              name="email"
              disabled={
                !isConnected ||
                !address ||
                isSigningIn ||
                accountStatus === "loading" ||
                accountStatus === "unauthenticated"
              }
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 h-14 w-full relative">
                      <IoMailOutline
                        size={16}
                        className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-5 z-10"
                      />
                      <Input
                        className="h-full rounded-full bg-background/80 backdrop-blur-2xl pl-11 pr-5"
                        disabled={
                          !isConnected ||
                          accountStatus === "loading" ||
                          accountStatus === "unauthenticated"
                        }
                        type="email"
                        placeholder="name@example.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              disabled={
                !isConnected ||
                !address ||
                isSigningIn ||
                accountStatus === "loading" ||
                accountStatus === "unauthenticated"
              }
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 h-14 w-full relative">
                      <GoShieldLock
                        size={16}
                        className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-5 z-10"
                      />
                      <Input
                        className="h-full rounded-full bg-background/80 backdrop-blur-2xl px-11"
                        disabled={
                          !isConnected ||
                          !address ||
                          isSigningIn ||
                          accountStatus === "loading" ||
                          accountStatus === "unauthenticated"
                        }
                        type={shouldShowPassword ? "text" : "password"}
                        placeholder="xxx xxx xxx xxx"
                        {...field}
                      />
                      {isConnected &&
                      accountStatus === "authenticated" &&
                      shouldShowPassword ? (
                        <GoEye
                          onClick={() => setShouldShowPassword(false)}
                          size={16}
                          className="text-muted-foreground absolute top-1/2 -translate-y-1/2 right-5 z-10 cursor-pointer"
                        />
                      ) : (
                        <GoEyeClosed
                          onClick={() => setShouldShowPassword(true)}
                          size={16}
                          className="text-muted-foreground absolute top-1/2 -translate-y-1/2 right-5 z-10 cursor-pointer"
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            size={"lg"}
            className="rounded-full w-full"
            type="submit"
            disabled={
              !isConnected ||
              !address ||
              isSigningIn ||
              accountStatus === "loading" ||
              accountStatus === "unauthenticated"
            }>
            {isSigningIn ? (
              <>
                <Loader className="animate-spin mr-2 size-4" />{" "}
                Authenticating...
              </>
            ) : (
              "Sign In to Continue"
            )}
          </Button>
        </form>
      </Form>

      <p className="flex items-center gap-4 my-5">
        <span className="h-px flex-1 bg-secondary" />
        <span className="text-sm">
          {address ? "Wallet address detected" : "Wallet address required"}
        </span>
        <span className="h-px flex-1 bg-secondary" />
      </p>

      <Button
        onClick={async () => await openWallet()}
        size={"lg"}
        disabled={isConnecting || isSigningIn || accountStatus === "loading"}
        className="rounded-full w-full">
        {isConnected ? (
          !address ? (
            "Unauthenticated"
          ) : (
            truncate(`${address}`)
          )
        ) : isConnecting ? (
          <>
            <Loader className="animate-spin mr-2 size-4" /> Connecting...
          </>
        ) : (
          "Connect Wallet"
        )}
      </Button>

      <AnimatePresence>
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.8 }}
            className="bg-background/80 backdrop-blur-xl rounded-2xl border px-4 py-2 mt-4">
            <div className="flex flex-col font-grotesk text-sm">
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Session Status</span>
                <span>{getIconFromStatus(accountStatus)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Network</span>
                <span>{chainId ? `eip155:${chainId}` : "N/A"}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-stone-500">Address</span>
                <span>{truncate(address) || "N/A"}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="/sign-up"
        className="text-muted-foreground text-sm mt-4 w-max">
        Don&apos;t have an account? <b className="text-primary">Sign Up</b>.
      </Link>
    </motion.div>
  );
}
