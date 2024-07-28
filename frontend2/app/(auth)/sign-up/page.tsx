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
import { Loader } from "lucide-react";
import { signUpSchema } from "@/lib/validators";
import { IoMailOutline } from "react-icons/io5";
import { GoShieldLock } from "react-icons/go";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { signUp } from "@/utils/db/apiAuth";
import Link from "next/link";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [shouldShowPassword, setShouldShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  const { isConnected, isConnecting, address, openWallet } = useAuth();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      address: `${address}` || "",
    },
  });

  useEffect(() => {
    form.setValue("address", `${address}`);
  }, [address]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    toast.loading(`Registering "${values.email}"`);
    try {
      setIsSigningIn(true);
      const result = await signUp(values);
      if (result) {
        toast.success("Registration successful 🎉");
        router.push("/sign-in");
      } else {
        toast.error("Error registering, try again");
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
            <h1 className="text-3xl md:text-4xl font-bold">
              Create an Account
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Create an account with your credentials to continue
            </p>
          </div>

          <div className="flex flex-col gap-2 my-6">
            <FormField
              control={form.control}
              name="username"
              disabled={!isConnected || !address || isSigningIn}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4 h-14 w-full relative">
                      <MdDriveFileRenameOutline
                        size={16}
                        className="text-muted-foreground absolute top-1/2 -translate-y-1/2 left-5 z-10"
                      />
                      <Input
                        className="h-full rounded-full bg-background/80 backdrop-blur-2xl pl-11 pr-5"
                        disabled={!isConnected}
                        type="text"
                        placeholder="Web Sculptor (optional)"
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
              name="email"
              disabled={!isConnected || !address || isSigningIn}
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
                        disabled={!isConnected}
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
              disabled={!isConnected || !address || isSigningIn}
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
                        disabled={!isConnected || !address || isSigningIn}
                        type={shouldShowPassword ? "text" : "password"}
                        placeholder="xxx xxx xxx xxx"
                        {...field}
                      />
                      {isConnected && shouldShowPassword ? (
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
            disabled={!isConnected || !address || isSigningIn}>
            {isSigningIn ? (
              <>
                <Loader className="animate-spin mr-2 size-4" /> Please wait...
              </>
            ) : (
              "Sign Up to Continue"
            )}
          </Button>
        </form>
      </Form>

      <p className="flex items-center gap-4 my-5">
        <span className="h-px flex-1 bg-secondary" />
        <span className="text-sm">
          {isConnected && address
            ? "Wallet address detected"
            : "Wallet address required"}
        </span>
        <span className="h-px flex-1 bg-secondary" />
      </p>

      <Button
        onClick={async () => await openWallet()}
        size={"lg"}
        disabled={isConnecting || isSigningIn}
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

      <Link
        href="/sign-in"
        className="text-muted-foreground text-sm mt-4 w-max">
        Already have an account? <b className="text-primary">Sign In</b>.
      </Link>
    </motion.div>
  );
}
