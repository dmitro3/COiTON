"use client";

import React, { useContext, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
// @ts-ignore
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { listingSchema } from "@/validations";

import { Loader2 } from "lucide-react";
import { FileUploader } from "@/components/shared/file-uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/authContext";
import { onUpload } from "@/lib/utils";

export default function CreateListingPage() {
  const router = useRouter();
  const data: ListingType = {
    owner: "",
    address: "",
    city: "",
    country: "",
    state: "",
    description: "",
    images: [],
    postalCode: "",
    price: "",
  };

  const user = useContext(AuthContext);

  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [listingData, setListingData] = useState<ListingType>(data);

  // 1. Define your form.
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: data,
  });

  async function uploadImagesToIPFS(files: any) {
    try {
      const fileUrl = await onUpload(files);

      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof listingSchema>) {
    try {
      setIsUploading(true);
      const fileUrls = await onUpload(files);

      if (fileUrls) {
        const data: ListingType = {
          owner: user?.credentials?.address,
          address: values.address,
          city: values.city,
          country: values.country,
          state: values.state,
          postalCode: values.postalCode,
          description: values.description,
          price: values.price,
          images: fileUrls,
        };

        const response = await fetch(
          "https://decentralized-real-estate-trading.onrender.com/api/v1/listings",
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create listing");
        }

        await response.json();
        toast("Listing created successfully", {
          description: "You are being redirected to the listing details",
        });
        // router.push(`/listing/${result?.data?.id}`);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast("Failed to create listing", {
        description:
          error.message || "An error occurred while creating the listing",
      });
    } finally {
      setIsUploading(false);
    }
  }

  if (!user?.isFetchingUser && !user?.credentials) {
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
                    disabled={isUploading || user?.isFetchingUser}
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
                      disabled={isUploading || user?.isFetchingUser}
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
                      disabled={isUploading || user?.isFetchingUser}
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
              name="country"
              render={({ field }: { field: any }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Country"
                      type="text"
                      {...field}
                      disabled={isUploading || user?.isFetchingUser}
                      className="w-full h-12 bg-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                      disabled={isUploading || user?.isFetchingUser}
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
                    <Input
                      placeholder="State"
                      type="text"
                      {...field}
                      disabled={isUploading || user?.isFetchingUser}
                      className="w-full h-12 bg-secondary/20"
                    />
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
                      disabled={isUploading || user?.isFetchingUser}
                      className="w-full h-12 bg-secondary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full p-6 border rounded-lg">
            <h1 className="text-base md:text-lg font-semibold">Upload files</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your files here or click to browse.
            </p>

            <FileUploader
              maxFiles={8}
              maxSize={8 * 1024 * 1024}
              onValueChange={setFiles}
              disabled={isUploading || user?.isFetchingUser}
            />
          </div>

          <Button
            disabled={isUploading || user?.isFetchingUser}
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

// TO LET
//
// Serviced 3 Bedroom Apartment located off Admiralty Way, Lekki phase 1, Lekki
//
// Rent-N5.5m per annum
// Service charge -N2m per annum, Agency-10%, Legal-10% and Caution Deposit-10%
//
// CONTACT TOPLIFT REALTORS ON 08029763540 or 07046057286

// Off Admiralty Way, Lekki Phase 1, Lekki, Lagos
