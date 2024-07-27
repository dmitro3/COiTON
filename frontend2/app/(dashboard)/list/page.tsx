"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { FileUploader } from "@/components/shared/file-uploader";
import Wrapper from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, onUpload, truncate } from "@/lib/utils";
import { Asterisk, CheckIcon, Loader, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { listingSchema } from "@/lib/validators";
import { Textarea } from "@/components/ui/textarea";
import { Country, State, City } from "country-state-city";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { GoTasklist } from "react-icons/go";
import { dummyStates, realEstateTypes } from "@/lib/constants";
import { useAuth } from "@/providers/authprovider";
import { toast } from "sonner";
import { useFetch } from "@/hooks/useFetch";
import { approveERC20, checkIfUserHasStaked } from "@/services/erc20Service";
import { variables } from "@/utils/env";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  const { isConnected, credentials } = useAuth();

  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState<any>();
  const [files, setFiles] = useState<File[]>([]);
  const [amenity, setAmenity] = useState<string[]>([]);
  const [countries, setCountries] = useState<any>([
    { label: "Nigeria", value: "NG", lat: "10.00000000", lng: "8.00000000" },
  ]);
  const [states, setStates] = useState<any>(dummyStates);

  const form = useForm<z.infer<typeof listingSchema>>({
    resolver: zodResolver(listingSchema),
  });

  const { fn: checkIfUserHasStakedFn }: IFetchHook = useFetch(
    checkIfUserHasStaked,
    credentials?.address
  );
  const { fn: approveERC20Fn }: IFetchHook = useFetch(approveERC20, {
    recipient: variables.daoAddress,
    amount: (20e18).toString(),
  });

  const onSubmit = async (values: z.infer<typeof listingSchema>) => {
    if (!credentials?.address) return toast.info("Wallet address is required");
    if (!coverPhoto)
      return toast.info("Please select a banner for your property");
    if (files.length === 0)
      return toast.info("Upload property image(s)", {
        description: "Users need to see what you want to list",
      });

    try {
      setIsCreating(true);
      toast.loading("Checking staked status...");
      let isStaked = await checkIfUserHasStakedFn();
      let proceed = false;

      if (!isStaked) {
        toast.dismiss();
        toast.loading("Approving staking...");
        proceed = await approveERC20Fn();
      } else {
        proceed = true;
      }

      if (!proceed) return;
      console.log("Has staked", isStaked);

      toast.dismiss();

      toast.loading("Storing property images...");
      const cover: any = await onUpload([coverPhoto]);
      const fileUrls: any = await onUpload(files);

      if (fileUrls !== undefined) {
        toast.dismiss();
        toast.loading("Creating listing...");

        const formData = {
          owner: credentials?.address,
          agentId: credentials?.address,
          region: `country=Nigeria;state=${values.state};city=${
            values.city
          };location=${values.location};propertyType=${
            values.realEstateTypes
          };title=${values.name};amenities=${amenity.join("~")}`,
          state: values.state,
          postalCode: values.postalCode,
          description: values.description,
          price: Number(values.price),
          images: fileUrls,
          coverImage: cover[0],
        };

        console.log(formData);

        try {
          const response = await axios.post(
            `${variables?.renderEndpoint}/listings`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const res = response.data;

          console.log(res.data);

          if (res.data.tx.success) {
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
        } catch (error: any) {
          console.error(error);
          toast.error("An error occurred while creating the listing", {
            description: error?.message,
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
      setIsCreating(false);
      toast.dismiss();
    }
  };

  function addAmenity(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      const newAmenity = form.getValues("amenities");
      if (newAmenity && !amenity.includes(newAmenity)) {
        setAmenity([...amenity, newAmenity]);
        form.setValue("amenities", "");
      }
    }
  }

  function removeAmenity(amenityToRemove: string) {
    setAmenity(amenity.filter((amt) => amt !== amenityToRemove));
  }

  return (
    <div className="flex-1">
      <Wrapper className="my-6 xl:my-6 px-4 md:px-8 flex flex-col md:flex-row lg:flex-col xl:flex-row gap-6 sm:gap-4 md:gap-6">
        <div className="pb-6 border-b sm:pb-0 sm:border-b-0 h-max w-full max-w-full md:max-w-xs lg:max-w-full xl:max-w-[400px] flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col gap-6 sm:gap-4 md:gap-6 relative md:sticky md:top-[85px] lg:relative lg:top-auto xl:sticky xl:top-[85px]">
          <div className="sm:p-5 md:pt-4 md:p-6 w-full sm:bg-background/80 sm:backdrop-blur-2xl sm:border rounded-2xl h-max">
            <p className="mb-2 text-xs sm:text-sm flex items-start text-foreground">
              Banner
            </p>
            <Input
              type="file"
              accept="image/*"
              id="coverPhoto"
              hidden
              onChange={(e: any) => setCoverPhoto(e.target.files[0])}
              disabled={isCreating || !isConnected}
              className="hidden"
            />
            <Label
              htmlFor="coverPhoto"
              className={cn("opacity-100 cursor-pointer pointer-events-auto", {
                "opacity-50 cursor-not-allowed pointer-events-none":
                  isCreating || !isConnected,
              })}>
              {coverPhoto ? (
                <div
                  className={cn(
                    "h-max bg-secondary/30 w-full rounded-lg overflow-hidden cursor-pointer p-2"
                  )}>
                  <Image
                    src={URL.createObjectURL(coverPhoto)}
                    alt="banner"
                    width={500}
                    height={500}
                    className="w-full h-max object-cover rounded-md"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "aspect-[1.6] bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 transition-colors rounded-lg flex items-center justify-center flex-col gap-2 text-center cursor-pointer border border-dashed"
                  )}>
                  <div className="rounded-full border border-dashed size-16 flex items-center justify-center">
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

          <div className="sm:p-5 md:pt-4 md:p-6  w-full sm:bg-background/80 sm:backdrop-blur-2xl sm:border rounded-2xl h-max">
            <p className="mb-2 text-xs sm:text-sm flex items-start text-foreground">
              Property Image
            </p>

            <FileUploader
              maxFiles={6}
              maxSize={8 * 1024 * 1024}
              onValueChange={setFiles}
              disabled={isCreating || !isConnected}
            />
          </div>
        </div>

        <div className="p-0 sm:p-5 md:p-6 flex-1 h-max sm:bg-background/80 sm:backdrop-blur-2xl sm:border rounded-2xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  disabled={isCreating || !isConnected}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Luxury Sunset Vista Villa"
                          type="text"
                          disabled={isCreating || !isConnected}
                          {...field}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-xs sm:text-sm flex items-start w-max text-foreground">
                    Owner
                  </p>

                  <div className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5 border flex items-center opacity-50 cursor-not-allowed">
                    {credentials?.address
                      ? truncate(`${credentials?.address}`)
                      : "0x2346...8fd2"}
                  </div>

                  <p className="text-xs font-normal text-muted-foreground">
                    Your address was automatically listed as the owner.
                  </p>
                </div>
              </div>

              <div className="sm:my-2 sm:pt-4 sm:pb-6 sm:border-y w-full flex flex-col gap-2 sm:gap-4">
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
                  <FormField
                    control={form.control}
                    name="country"
                    disabled
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                          Country{" "}
                        </FormLabel>

                        <Select disabled defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              disabled
                              className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
                              {!field.value ? (
                                <p className="flex items-start text-muted-foreground">
                                  Select a Country
                                </p>
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map(
                              (country: any, countryIndex: any) => (
                                <SelectItem
                                  disabled
                                  key={countryIndex}
                                  value={country.value}>
                                  {country.label}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    disabled={isCreating || !isConnected}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                          State
                        </FormLabel>

                        <Select
                          disabled={isCreating || !isConnected}
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger
                              disabled={isCreating || !isConnected}
                              className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
                              {!field.value ? (
                                <p className="flex items-start text-muted-foreground">
                                  Select a state
                                </p>
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.length === 0 ? (
                              <p className="py-2 text-center text-sm">
                                No states found.
                              </p>
                            ) : (
                              states.map((state: any, stateIndex: any) => (
                                <SelectItem key={stateIndex} value={state}>
                                  {state}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    disabled={isCreating || !isConnected}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                          City
                        </FormLabel>

                        <FormControl>
                          <Input
                            placeholder="Ikorodu Lagos (optional)"
                            type="text"
                            disabled={isCreating || !isConnected}
                            {...field}
                            className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
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
                    name="location"
                    disabled={isCreating || !isConnected}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                          Address{" "}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1/3 Adebola Gbadebo Drv. (Adebola House) Off Abadek Avenue, off Akin Ogunlewe Rd, Igbogbo, Ikorodu, Lagos"
                            disabled={isCreating || !isConnected}
                            type="text"
                            {...field}
                            className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    disabled={isCreating || !isConnected}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                          ZipCode
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="800104 (optional)"
                            type="text"
                            disabled={isCreating || !isConnected}
                            {...field}
                            className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="realEstateTypes"
                disabled={isCreating || !isConnected}
                render={({ field }: { field: any }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                      RealEstate Type{" "}
                    </FormLabel>
                    <Select
                      disabled={isCreating || !isConnected}
                      onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          disabled={isCreating || !isConnected}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
                          {!field.value ? (
                            <p className="flex items-start text-muted-foreground">
                              {realEstateTypes[0]}
                            </p>
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {realEstateTypes.map((state: any) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="price"
                  disabled={isCreating || !isConnected}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                        Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="$ 350,000"
                          type="text"
                          disabled={isCreating || !isConnected}
                          {...field}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amenities"
                  disabled={isCreating || !isConnected}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs sm:text-sm flex items-center justify-between w-full text-foreground">
                        <span className="flex items-start">Amenities</span>

                        {amenity.length > 0 && (
                          <Popover>
                            <PopoverTrigger
                              disabled={isCreating || !isConnected}>
                              <span className="flex items-center cursor-pointer">
                                {amenity.length}{" "}
                                <GoTasklist size={17} className="ml-1" />
                              </span>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 py-1">
                              {amenity.map((item, index) => (
                                <li
                                  className="text-sm text-muted-foreground flex items-center justify-between px-3 py-1"
                                  key={index}>
                                  {item}{" "}
                                  <X
                                    size={14}
                                    className="ml-2 cursor-pointer"
                                    onClick={() => removeAmenity(item)}
                                  />
                                </li>
                              ))}
                            </PopoverContent>
                          </Popover>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fully Automated Smart Homes"
                          type="text"
                          disabled={isCreating || !isConnected}
                          {...field}
                          onKeyDown={addAmenity}
                          className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
                        />
                      </FormControl>
                      <FormMessage />

                      <FormDescription className="text-xs font-normal text-muted-foreground">
                        After inputting your amenity, press enter to add.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                disabled={isCreating || !isConnected}
                render={({ field }: { field: any }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
                      Description{" "}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        cols={8}
                        rows={8}
                        placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, sint?"
                        disabled={isCreating || !isConnected}
                        className="bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 text-xs sm:text-sm rounded-2xl py-4 px-5"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size={"lg"}
                disabled={isCreating || !isConnected}
                className="w-full rounded-full h-12"
                variant={"initial"}>
                {isCreating ? (
                  <>
                    <Loader className="animate-spin mr-2 size-4" />
                    Please wait...
                  </>
                ) : (
                  "List Property"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </Wrapper>
    </div>
  );
}

// TODO: RETURN AFTER HACKATHON
// "use client";

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, Controller } from "react-hook-form";
// import { FileUploader } from "@/components/shared/file-uploader";
// import Wrapper from "@/components/shared/wrapper";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn, truncate } from "@/lib/utils";
// import { Asterisk, CheckIcon, Upload, X } from "lucide-react";
// import Image from "next/image";
// import React, { useEffect, useState } from "react";
// import { listingSchema } from "@/lib/validators";
// import { Textarea } from "@/components/ui/textarea";
// import { Country, State, City } from "country-state-city";
// import { CaretSortIcon } from "@radix-ui/react-icons";
// import { GoTasklist } from "react-icons/go";
// import { realEstateTypes } from "@/lib/constants";
// import { useAuth } from "@/providers/authprovider";
// import { toast } from "sonner";

// export default function CreatePage() {
//   const { isConnected, credentials } = useAuth();

//   const [coverPhoto, setCoverPhoto] = useState<File>();
//   const [files, setFiles] = useState<File[]>([]);
//   const [amenity, setAmenity] = useState<string[]>([]);
//   const [countries, setCountries] = useState<any>([]);
//   const [states, setStates] = useState<any>([]);
//   const [cities, setCities] = useState<any>([]);

//   const form = useForm<z.infer<typeof listingSchema>>({
//     resolver: zodResolver(listingSchema),
//     defaultValues: {
//       name: "Luxury Sunset Vista Villa",
//       location:
//         "1/3 Adebola Gbadebo Drv. (Adebola House) Off Abadek Avenue, off Akin Ogunlewe Rd, Igbogbo, Ikorodu, Lagos",
//       description: "This is a dummy description for some reason",
//       postalCode: "800143",
//       price: "500000",
//       amenities: "Fully Automated Smart Homes",
//       realEstateTypes: realEstateTypes[0],
//     },
//   });

//   useEffect(() => {
//     setCountries(
//       Country.getAllCountries().map((cty) => ({
//         label: cty.name,
//         value: cty.isoCode,
//         lat: cty.latitude,
//         lng: cty.longitude,
//       }))
//     );
//   }, []);

//   const handleCountryChange = (value: any) => {
//     const selectedCountry = countries.find(
//       (country: any) => country.value === value
//     );
//     setStates(
//       State.getStatesOfCountry(selectedCountry.value).map((sts) => ({
//         label: sts.name,
//         value: sts.isoCode,
//         lat: sts.latitude,
//         lng: sts.longitude,
//       }))
//     );
//     setCities([]);
//     form.setValue("state", "");
//     form.setValue("city", "");
//   };

// const handleStateChange = (value: any) => {
//   const selectedCountry = form.getValues("country");
//   const selectedState = states.find((state: any) => state.value === value);
//   setCities(
//     City.getCitiesOfState(selectedCountry, selectedState.value).map(
//       (cis) => ({
//         label: cis.name,
//         value: cis.name,
//         lat: cis.latitude,
//         lng: cis.longitude,
//       })
//     )
//   );
//   form.setValue("city", "");
// };

//   const onSubmit = async (values: z.infer<typeof listingSchema>) => {
//     const selectedCountry = countries.find(
//       (country: any) => country?.value === values.country
//     )?.label;
//     const selectedState = states.find(
//       (state: any) => state?.value === values.state
//     )?.label;
//     const selectedCity = cities.find(
//       (city: any) => city?.value === values.city
//     )?.label;

//     const redefinedValues = {
//       ...values,
//       owner: credentials?.address,
//       country: selectedCountry,
//       state: selectedState,
//       city: selectedCity,
//       amenities: amenity,
//     };

//     console.log(redefinedValues);
//   };

//   function addAmenity(e: React.KeyboardEvent<HTMLInputElement>) {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const newAmenity = form.getValues("amenities");
//       if (newAmenity && !amenity.includes(newAmenity)) {
//         setAmenity([...amenity, newAmenity]);
//         form.setValue("amenities", "");
//       }
//     }
//   }

//   function removeAmenity(amenityToRemove: string) {
//     setAmenity(amenity.filter((amt) => amt !== amenityToRemove));
//   }

//   return (
//     <div className="flex-1">
//       <Wrapper className="my-6 xl:my-6 px-4 md:px-8 flex flex-col md:flex-row lg:flex-col xl:flex-row gap-6 sm:gap-4 md:gap-6">
//         <div className="pb-6 border-b sm:pb-0 sm:border-b-0 h-max w-full max-w-full md:max-w-xs lg:max-w-full xl:max-w-[400px] flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col gap-6 sm:gap-4 md:gap-6 relative md:sticky md:top-[85px] lg:relative lg:top-auto xl:sticky xl:top-[85px]">
//           <div className="sm:p-5 md:pt-4 md:p-6 w-full sm:bg-background/80 sm:backdrop-blur-2xl sm:border rounded-2xl h-max">
//             <p className="mb-2 text-xs sm:text-sm flex items-start text-foreground">
//               Banner
//             </p>
//             <Input
//               type="file"
//               accept="image/*"
//               id="coverPhoto"
//               hidden
//               onChange={(e: any) => setCoverPhoto(e.target.files[0])}
//               className="hidden"
//             />
//             <Label htmlFor="coverPhoto">
//               {coverPhoto ? (
//                 <div
//                   className={cn(
//                     "h-max bg-secondary/30 w-full rounded-lg overflow-hidden cursor-pointer p-2"
//                   )}>
//                   <Image
//                     src={URL.createObjectURL(coverPhoto)}
//                     alt="banner"
//                     width={500}
//                     height={500}
//                     className="w-full h-max object-cover rounded-md"
//                   />
//                 </div>
//               ) : (
//                 <div
//                   className={cn(
//                     "aspect-[1.6] bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 transition-colors rounded-lg flex items-center justify-center flex-col gap-2 text-center cursor-pointer border border-dashed"
//                   )}>
//                   <div className="rounded-full border border-dashed size-16 flex items-center justify-center">
//                     <Upload
//                       className="size-7 text-muted-foreground"
//                       aria-hidden="true"
//                     />
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     Select a banner for your property
//                   </p>
//                 </div>
//               )}
//             </Label>
//           </div>

//           <div className="sm:p-5 md:p-6 w-full sm:bg-background/80 sm:backdrop-blur-2xl sm:border rounded-2xl h-max">
//             <p className="mb-2 text-xs sm:text-sm flex items-start text-foreground">
//               Property Image
//             </p>

//             <FileUploader
//               maxFiles={6}
//               maxSize={8 * 1024 * 1024}
//               onValueChange={setFiles}
//             />
//           </div>
//         </div>

//         <div className="p-0 sm:p-5 md:p-6 flex-1 h-max sm:bg-background/80 sm:backdrop-blur-2xl sm:border rounded-2xl">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className="w-full flex flex-col gap-2 sm:gap-4">
//               <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                         Title
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Luxury Sunset Vista Villa"
//                           type="text"
//                           {...field}
//                           className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="flex-1 flex flex-col gap-1">
//                   <p className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                     Owner
//                   </p>

//                   <div className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5 border flex items-center opacity-50 cursor-not-allowed">
//                     {credentials?.address
//                       ? truncate(`${credentials?.address}`)
//                       : "0x2346...8fd2"}
//                   </div>

//                   <p className="text-xs font-normal text-muted-foreground">
//                     Your address was automatically listed as the owner.
//                   </p>
//                 </div>
//                 {/* <FormField
//                   control={form.control}
//                   name="owner"
//                   disabled
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                         Owner
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           disabled
//                           placeholder="0x2346...8fd2"
//                           type="text"
//                           {...field}
//                           value={
//                             credentials?.address
//                               ? truncate(`${credentials?.address}`)
//                               : ""
//                           }
//                           className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
//                         />
//                       </FormControl>
//                       {credentials?.address && (
//                         <FormDescription>
//                           Your address was automatically listed as the owner.
//                         </FormDescription>
//                       )}
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 /> */}
//               </div>

//               <div className="sm:my-2 sm:pt-4 sm:pb-6 sm:border-y w-full flex flex-col gap-2 sm:gap-4">
//                 <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
//                   <FormField
//                     control={form.control}
//                     name="country"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                           Country{" "}
//                         </FormLabel>

//                         <Select
//                           onValueChange={(value) => {
//                             field.onChange(value);
//                             handleCountryChange(value);
//                           }}
//                           defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
//                               {!field.value ? (
//                                 <p className="flex items-start text-muted-foreground">
//                                   Select a Country
//                                 </p>
//                               ) : (
//                                 <SelectValue />
//                               )}
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {countries.map(
//                               (country: any, countryIndex: any) => (
//                                 <SelectItem
//                                   key={countryIndex}
//                                   value={country.value}>
//                                   {country.label}
//                                 </SelectItem>
//                               )
//                             )}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="state"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                           State
//                         </FormLabel>

//                         <Select
//                           onValueChange={(value) => {
//                             field.onChange(value);
//                             handleStateChange(value);
//                           }}
//                           defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
//                               {!field.value ? (
//                                 <p className="flex items-start text-muted-foreground">
//                                   Depends on Country
//                                 </p>
//                               ) : (
//                                 <SelectValue />
//                               )}
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {states.length === 0 ? (
//                               <p className="py-2 text-center text-sm">
//                                 No states found.
//                               </p>
//                             ) : (
//                               states.map((state: any, stateIndex: any) => (
//                                 <SelectItem
//                                   key={stateIndex}
//                                   value={state.value}>
//                                   {state.label}
//                                 </SelectItem>
//                               ))
//                             )}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="city"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                           City
//                         </FormLabel>

//                         <Select
//                           onValueChange={field.onChange}
//                           defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
//                               {!field.value ? (
//                                 <p className="flex items-start text-muted-foreground">
//                                   Depends on State (optional)
//                                 </p>
//                               ) : (
//                                 <SelectValue />
//                               )}
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {cities.length === 0 ? (
//                               <p className="py-2 text-center text-sm">
//                                 No cities found.
//                               </p>
//                             ) : (
//                               cities.map((city: any, cityIndex: any) => (
//                                 <SelectItem key={cityIndex} value={city.value}>
//                                   {city.label}
//                                 </SelectItem>
//                               ))
//                             )}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
//                   <FormField
//                     control={form.control}
//                     name="location"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                           Address{" "}
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="1/3 Adebola Gbadebo Drv. (Adebola House) Off Abadek Avenue, off Akin Ogunlewe Rd, Igbogbo, Ikorodu, Lagos"
//                             type="text"
//                             {...field}
//                             className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="postalCode"
//                     render={({ field }) => (
//                       <FormItem className="flex-1">
//                         <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                           ZipCode
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             placeholder="800104 (optional)"
//                             type="text"
//                             {...field}
//                             className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>

//               <FormField
//                 control={form.control}
//                 name="realEstateTypes"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                       RealEstate Type{" "}
//                     </FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}>
//                       <FormControl>
//                         <SelectTrigger className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full px-5">
//                           {!field.value ? (
//                             <p className="flex items-start text-muted-foreground">
//                               {realEstateTypes[0]}
//                             </p>
//                           ) : (
//                             <SelectValue />
//                           )}
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {realEstateTypes.map((state: any) => (
//                           <SelectItem key={state} value={state}>
//                             {state}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row w-full gap-2 sm:gap-4 flex-1">
//                 <FormField
//                   control={form.control}
//                   name="price"
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                         Price
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="$ 350,000"
//                           type="text"
//                           {...field}
//                           className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="amenities"
//                   render={({ field }) => (
//                     <FormItem className="flex-1">
//                       <FormLabel className="text-xs sm:text-sm flex items-center justify-between w-full text-foreground">
//                         <span className="flex items-start">Amenities </span>

//                         {amenity.length > 0 && (
//                           <Popover>
//                             <PopoverTrigger>
//                               <span className="flex items-center cursor-pointer">
//                                 {amenity.length}{" "}
//                                 <GoTasklist size={17} className="ml-1" />
//                               </span>
//                             </PopoverTrigger>
//                             <PopoverContent className="p-0 py-1">
//                               {amenity.map((item, index) => (
//                                 <li
//                                   className="text-sm text-muted-foreground flex items-center justify-between px-3 py-1"
//                                   key={index}>
//                                   {item}{" "}
//                                   <X
//                                     size={14}
//                                     className="ml-2 cursor-pointer"
//                                     onClick={() => removeAmenity(item)}
//                                   />
//                                 </li>
//                               ))}
//                             </PopoverContent>
//                           </Popover>
//                         )}
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder="Fully Automated Smart Homes"
//                           type="text"
//                           {...field}
//                           onKeyDown={addAmenity}
//                           className="w-full h-12 text-xs sm:text-sm bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 rounded-full"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }: { field: any }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel className="text-xs sm:text-sm flex items-start w-max text-foreground">
//                       Description{" "}
//                     </FormLabel>
//                     <FormControl>
//                       <Textarea
//                         cols={8}
//                         rows={8}
//                         placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, sint?"
//                         className="bg-secondary/40 backdrop-blur-2xl sm:backdrop-blur-none sm:bg-secondary/30 text-xs sm:text-sm rounded-2xl py-4 px-5"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <Button
//                 type="submit"
//                 size={"lg"}
//                 className="w-full rounded-full h-12"
//                 variant={"initial"}>
//                 List Property
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </Wrapper>
//     </div>
//   );
// }
