"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Loader } from "lucide-react";
import { site } from "@/constants";
import { useAuthContext } from "@/providers/authcontext";
import { shortenAddress } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInSchema } from "@/validators";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();

  const { connectAccount, address, isConnected, loginUser, isLoadingAuth } =
    useAuthContext();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    toast.loading("Please wait...");
    const requiredValues = {
      email: values.email,
      password: values.password,
      address: address,
    };

    try {
      const { data, error }: any = await loginUser(requiredValues);
      if (error) {
        toast.error("Something went wrong", {
          description: error,
        });
        return;
      } else {
        toast.success("Welcome back", {
          description: "You are being redirected to the dashboard",
        });

        router.replace("/dashboard");
      }
    } catch (error: any) {
      toast.error("Something went wrong", {
        description: error.message,
      });
      console.log(error);
    } finally {
      toast.dismiss();
    }
  }

  return (
    <div className="w-full max-w-md md:p-6 flex flex-col items-center">
      <div className="w-20 h-20">
        <Image
          src="/img/logo.png"
          alt="logo"
          width={512}
          height={512}
          priority
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="mt-4 text-[1.25rem] font-medium text-center">
        Login to your Account
      </h1>
      <p className="text-sm mt-1 text-muted-foreground text-center px-4">
        Enter your login details to continue using {site.name}.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 mt-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@gmail.com"
                    type="email"
                    autoComplete="username"
                    disabled={!isConnected || isLoadingAuth}
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="xxxx xxxx xxxx xxxx"
                    type="password"
                    autoComplete="current-password"
                    disabled={!isConnected || isLoadingAuth}
                    {...field}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-3 h-11"
            size="lg"
            disabled={!isConnected || isLoadingAuth}>
            {isLoadingAuth ? (
              <>
                <Loader className="w-4 h-4 animate-spin mr-2" />
                Please wait...
              </>
            ) : (
              "Continue"
            )}
          </Button>

          <p className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <span className="flex-1 border" />
            {isConnected
              ? "You're good to go"
              : "You need to connect your wallet"}{" "}
            <span className="flex-1 border" />
          </p>

          <Button
            type="button"
            className="h-11"
            size="lg"
            variant="secondary"
            disabled={isLoadingAuth}
            onClick={connectAccount}>
            {isConnected
              ? address && shortenAddress(address as string)
              : "Connect Wallet"}
          </Button>

          <p className="text-sm text-muted-foreground font-medium text-start mt-2">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary">
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
