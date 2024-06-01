"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import MaxWrapper from "@/components/shared/max-wrapper";
import { Asterisk, Loader, Plus, Upload, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { listingSchema } from "@/validations";
import { useRouter } from "next/navigation";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { cn, onUpload, shortenAddress } from "@/lib/utils";
import { states } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { useAuth } from "@/context/authContext";
import {
  RENDER_ENDPOINT,
  useCheckIfUserStaked,
  useStake,
} from "@/hooks/contract";
import { toast } from "sonner";

export default function CreateListingPage() {
  const router = useRouter();
  const { credentials, isFetchingUser } = useAuth();
  const { isLoading, checkIsStaked } = useCheckIfUserStaked();
  const { handleApproveERC20, isLoading: isStaking } = useStake();

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<any>();

  const data: any = {
    owner: "",
    agentId: "",
    region: "",
    postalCode: "",
    description: "",
    price: "",
    images: [],
    coverImage: "",
  };

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
    defaultValues: data,
  });

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    if (!values?.address)
      return toast.error("You need to connect your address");
    if (!coverPhoto)
      return toast.error("Please select a banner for your property");
    if (files.length === 0)
      return toast.error("Upload property image(s)", {
        description: "Users need to see what you want to sell",
      });
    try {
      setIsUploading(true);
      let isStaked = await checkIsStaked();
      let proceed = false;

      if (!isStaked) {
        proceed = await handleApproveERC20(
          (20e18).toString(),
          process.env.NEXT_PUBLIC_DAO_ADDRESS as string
        );
      } else {
        proceed = true;
      }

      if (!proceed) return;
      console.log("Has staked", isStaked);

      toast.loading("Uploading files...");
      const cover = await onUpload([coverPhoto]);
      const fileUrls = await onUpload(files);

      if (fileUrls) {
        toast.dismiss();
        toast.success("Files uploaded successfully");

        const data: any = {
          owner: credentials?.address.toString(),
          agentId: credentials?.address.toString(),
          region: `${values.state};${values.city};${values.address}`,
          state: values.state,
          postalCode: values.postalCode,
          description: `${values.name};${values.description};${values.amenities}`,
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
              "Your listing will be approved by the DAO within 24 hours",
          });
          router.push("/dashboard");
          console.log(res);
        } else {
          toast.error(res.data.tx.message, {
            description: "An error occurred while creating the listing",
          });
        }
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
  };

  return (
    <div className="w-full flex flex-col relative">
      <MaxWrapper className="mb-6 xl:mb-6 px-0 lg:px-0 xl:px-0 2xl:px-4 flex flex-col md:flex-row lg:flex-col xl:flex-row gap-6 sm:gap-4 md:gap-6">
        <div className="pb-6 border-b sm:pb-0 sm:border-b-0 h-max w-full max-w-full md:max-w-xs lg:max-w-full xl:max-w-[400px] flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col gap-6 sm:gap-4 md:gap-6 relative md:sticky md:top-[80px] lg:relative lg:top-auto xl:sticky xl:top-[80px]">
          <div className="sm:p-4 w-full bg-transparent sm:bg-secondary/30 rounded-lg h-max">
            <p className="mb-1 text-xs sm:text-sm flex items-start text-foreground">
              Banner <Asterisk className="w-3 h-3 text-primary" />
            </p>
            <Input
              type="file"
              accept="image/*"
              id="coverPhoto"
              hidden
              onChange={(e: any) => setCoverPhoto(e.target.files[0])}
              className="w-full h-12 bg-secondary/20 hidden"
              disabled={
                isUploading ||
                isFetchingUser ||
                isStaking ||
                credentials === null
              }
            />
            <Label htmlFor="coverPhoto">
              {coverPhoto ? (
                <div
                  className={cn(
                    "aspect-[1.3] bg-secondary sm:bg-background w-full rounded-lg overflow-hidden cursor-pointer p-2",
                    {
                      "pointer-events-none opacity-50":
                        isUploading || isFetchingUser || isStaking,
                    }
                  )}>
                  <Image
                    src={URL.createObjectURL(coverPhoto)}
                    alt="banner"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "aspect-[1.6] bg-secondary/30 hover:bg-secondary/20 sm:bg-background/50 sm:hover:bg-background/60 transition-colors rounded-lg flex items-center justify-center flex-col gap-2 text-center cursor-pointer border border-dashed",
                    {
                      "pointer-events-none opacity-50":
                        isUploading || isFetchingUser || isStaking,
                    }
                  )}>
                  <div className="rounded-full border border-dashed p-3">
                    <Upload
                      className="size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Select a banner for your property
                  </p>
                </div>
              )}
            </Label>
          </div>

          <div className="sm:p-4 w-full bg-transparent sm:bg-secondary/30 rounded-lg h-max">
            <p className="mb-1 text-xs sm:text-sm flex items-start text-foreground">
              Images <Asterisk className="w-3 h-3 text-primary" />
            </p>

            <FileUploader
              maxFiles={6}
              maxSize={8 * 1024 * 1024}
              onValueChange={setFiles}
              disabled={
                isUploading ||
                isFetchingUser ||
                isStaking ||
                credentials === null
              }
            />
          </div>
        </div>

        <div className="p-0 sm:p-4 md:p-5 flex-1 h-max bg-transparent sm:bg-secondary/30 rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        Title <Asterisk className="w-3 h-3 text-primary" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Luxury Sunset Vista Villa"
                          type="text"
                          {...field}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40"
                          disabled={
                            isUploading ||
                            isFetchingUser ||
                            isStaking ||
                            credentials === null
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        Owner
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Web Sculptor"
                          type="text"
                          {...field}
                          value={
                            credentials?.address ? credentials?.address : ""
                          }
                          disabled={
                            !!credentials?.address ||
                            isUploading ||
                            isFetchingUser ||
                            isStaking
                          }
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40"
                        />
                      </FormControl>
                      {credentials?.address && (
                        <FormDescription>
                          Your address was automatically listed as the owner.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        Address <Asterisk className="w-3 h-3 text-primary" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1/3 Adebola Gbadebo Drv. (Adebola House) Off Abadek Avenue, off Akin Ogunlewe Rd, Igbogbo, Ikorodu, Lagos"
                          type="text"
                          disabled={
                            isUploading ||
                            isFetchingUser ||
                            isStaking ||
                            credentials === null
                          }
                          {...field}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40"
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
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        ZIP Code <Asterisk className="w-3 h-3 text-primary" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="800104"
                          type="text"
                          disabled={
                            isUploading ||
                            isFetchingUser ||
                            isStaking ||
                            credentials === null
                          }
                          {...field}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        City <Asterisk className="w-3 h-3 text-primary" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ikorodu Lagos"
                          type="text"
                          disabled={
                            isUploading ||
                            isFetchingUser ||
                            isStaking ||
                            credentials === null
                          }
                          {...field}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }: { field: any }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        State <Asterisk className="w-3 h-3 text-primary" />
                      </FormLabel>
                      <FormControl>
                        <Select
                          name="state"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={
                            isUploading ||
                            isFetchingUser ||
                            isStaking ||
                            credentials === null
                          }>
                          <SelectTrigger className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40">
                            {!field.value ? (
                              <p className="flex items-start text-muted-foreground">
                                Lagos State
                              </p>
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {states.map((state: any) => (
                              <SelectItem key={state} value={state}>
                                {state} State
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                      Price <Asterisk className="w-3 h-3 text-primary" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$ 350,000"
                        type="text"
                        disabled={
                          isUploading ||
                          isFetchingUser ||
                          isStaking ||
                          credentials === null
                        }
                        {...field}
                        className="w-full h-12 text-xs sm:text-sm bg-secondary/20 sm:bg-background/40"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                      Description <Asterisk className="w-3 h-3 text-primary" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        cols={8}
                        rows={8}
                        placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, sint?"
                        disabled={
                          isUploading ||
                          isFetchingUser ||
                          isStaking ||
                          credentials === null
                        }
                        className="bg-secondary/20 sm:bg-background/40 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amenities"
                render={({ field }: { field: any }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                      Amenities <Asterisk className="w-3 h-3 text-primary" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        cols={8}
                        rows={8}
                        placeholder="Fully Automated Smart Homes"
                        disabled={
                          isUploading ||
                          isFetchingUser ||
                          isStaking ||
                          credentials === null
                        }
                        className="bg-secondary/20 sm:bg-background/40 text-xs sm:text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 mt-2"
                disabled={
                  isUploading ||
                  isFetchingUser ||
                  isStaking ||
                  credentials === null
                }>
                {isUploading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </MaxWrapper>
    </div>
  );
}
