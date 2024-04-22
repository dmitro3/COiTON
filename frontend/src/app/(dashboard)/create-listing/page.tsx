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
import { AuthContext } from "@/context/authentication";
import { Loader2 } from "lucide-react";
import { FileUploader } from "@/components/shared/file-uploader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const { user, isFetchingUser } = useContext(AuthContext);

  const [files, setFiles] = React.useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [listingData, setListingData] = useState<ListingType>(data);

  // 1. Define your form.
  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: data,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof listingSchema>) {
    const data: ListingType = {
      owner: user?.name,
      address: values.address,
      city: values.city,
      country: values.country,
      state: values.state,
      postalCode: String(values.postalCode), // Ensure postalCode is always a string
      description: values.description,
      price: String(values.price), // Ensure price is always a string
      images: files,
    };

    setListingData(data);
    toast("Submitted Data", {
      description: JSON.stringify(data),
    });
  }

  if (!isFetchingUser && !user) {
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
                    disabled={isUploading || isFetchingUser}
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
                      type="number"
                      {...field}
                      disabled={isUploading || isFetchingUser}
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
                      disabled={isUploading || isFetchingUser}
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
                      disabled={isUploading || isFetchingUser}
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
                      disabled={isUploading || isFetchingUser}
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
                      disabled={isUploading || isFetchingUser}
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
                      type="number"
                      {...field}
                      disabled={isUploading || isFetchingUser}
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
              disabled={isUploading || isFetchingUser}
            />
          </div>

          <Button
            disabled={isUploading || isFetchingUser}
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
