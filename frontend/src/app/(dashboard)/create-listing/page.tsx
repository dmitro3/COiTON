"use client";

import React, { useContext, useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
// @ts-ignore
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listingSchema } from "@/validations";

import { Camera, Check, Loader2 } from "lucide-react";
import { FileUploader } from "@/components/shared/file-uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn, onUpload } from "@/lib/utils";
import {
  RENDER_ENDPOINT,
  useCheckIfUserStaked,
  useStake,
} from "@/hooks/useFetchBackend";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/authContext";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/constants";
import { ApproveStake } from "@/components/shared/approve-stake";

export default function CreateListingPage() {
  const router = useRouter();
  const data: any = {
    owner: "",
    agentId: "",
    region: "",
    postalCode: "",
    description: "",
    price: 0,
    images: [],
    coverImage: "",
  };

  const { credentials, isFetchingUser } = useAuth();
  const { isLoading, checkIsStaked } = useCheckIfUserStaked();
  const { handleApproveERC20, isLoading: isStaking } = useStake();

  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<any>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: data,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof listingSchema>) {
    try {
      setIsUploading(true);
      let isStaked = await checkIsStaked();
      let proceed = false;

      if (!isStaked) {
        proceed = await handleApproveERC20((20e18).toString(), process.env.NEXT_PUBLIC_DAO_ADDRESS as string);
      } else {
        proceed = true;
      }

      if (!proceed) return;
      console.log("Has staked", isStaked);

      toast.loading("Uploading files to IPFS...");
      const cover = await onUpload([coverPhoto]);
      const fileUrls = await onUpload(files);

      if (fileUrls) {
        toast.dismiss();
        toast.success("Files uploaded successfully");
        const data: any = {
          owner: credentials?.address,
          agentId: credentials?.address,
          region: `${values.state};${values.city};${values.address}`,
          state: values.state,
          postalCode: values.postalCode,
          description: `${values.description};${values.features}`,
          price: Number(values.price),
          images: fileUrls,
          coverImage: cover[0],
        };

        // values.features.split("\n")

        toast.loading("Creating listing...");
        const response = await fetch(`${RENDER_ENDPOINT}/listings`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const res = await response.json();

        console.log(res.data);

        if (res.data.tx.success === true) {
          toast.success(res.data.tx.message, {
            description:
              "You are being redirected to the dashboard\nYour listing will be approved by the DAO within 24 hours",
          });
          router.push("/dashboard");
          console.log(res);
        } else {
          toast.error(res.data.tx.message, {
            description: "Your state has not been register in the DAO",
          });
        }
        // router.push(`/listing/${result?.data?.id}`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to create listing", {
        description:
          error.message || "An error occurred while creating the listing",
      });
    } finally {
      setIsUploading(false);
      toast.dismiss();
    }
  }

  if (!isFetchingUser && !credentials) {
    return router.push("/login");
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl capitalize font-bold">
        Create a new Listing
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 md:gap-4 mt-4 mb-6 max-w-2xl w-full">
          <FormField
            control={form.control}
            name="description"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    cols={8}
                    rows={8}
                    placeholder="Description"
                    className="bg-secondary/20"
                    disabled={isUploading || isFetchingUser || isStaking}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center flex-col md:flex-row gap-3 md:gap-4 w-full">
            <FormField
              control={form.control}
              name="price"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Price"
                      type="text"
                      {...field}
                      disabled={isUploading || isFetchingUser || isStaking}
                      className="w-full h-12 bg-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Address"
                      type="text"
                      {...field}
                      disabled={isUploading || isFetchingUser || isStaking}
                      className="w-full h-12 bg-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center flex-col md:flex-row gap-3 md:gap-4 w-full">
            <Label
              htmlFor="coverPhoto"
              className={cn(
                "w-14 h-12 flex items-center justify-center text-foreground bg-secondary/20 border rounded cursor-pointer",
                {
                  "opacity-50 cursor-default select-none":
                    isUploading || isFetchingUser,
                }
              )}>
              {!coverPhoto ? (
                <Camera className="w-5 h-5" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
            </Label>
            <Input
              type="file"
              accept="image/*"
              id="coverPhoto"
              hidden
              onChange={(e: any) => setCoverPhoto(e.target.files[0])}
              disabled={isUploading || isFetchingUser || isStaking}
              className="w-full h-12 bg-secondary/20 hidden"
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="City"
                      type="text"
                      {...field}
                      disabled={isUploading || isFetchingUser || isStaking}
                      className="w-full h-12 bg-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center flex-col md:flex-row gap-3 md:gap-4 w-full">
            <FormField
              control={form.control}
              name="state"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      name="state"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isUploading || isFetchingUser || isStaking}>
                      <SelectTrigger className="w-full h-12 bg-secondary/20">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state: any) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Postal Code"
                      type="text"
                      {...field}
                      disabled={isUploading || isFetchingUser || isStaking}
                      className="w-full h-12 bg-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="features"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    cols={8}
                    rows={8}
                    placeholder="Features"
                    className="bg-secondary/20"
                    disabled={isUploading || isFetchingUser || isStaking}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Each feature should be separated with a new line by clicking
                  enter
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="w-full p-4 border rounded-lg">
            <h1 className="text-base md:text-lg font-semibold">Upload files</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your files here or click to browse.
            </p>

            <FileUploader
              maxFiles={8}
              maxSize={8 * 1024 * 1024}
              onValueChange={setFiles}
              disabled={isUploading || isFetchingUser || isStaking}
            />
          </div>

          <Button
            disabled={isUploading || isFetchingUser || isStaking}
            type="submit"
            className="h-12">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
