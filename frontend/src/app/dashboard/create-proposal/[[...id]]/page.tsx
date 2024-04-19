"use client";

import { zodResolver } from "@hookform/resolvers/zod";
// @ts-ignore
import { useForm, SubmitHandler } from "react-hook-form";
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

const formSchema = z.object({
  address: z.string().min(2).max(50).trim(),
  amount: z.string().min(2).max(50).trim(),
});

export default function CreateProposal() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      amount: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="flex-1 py-6 flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl font-bold">Create Proposal</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-screen-sm">
          <FormField
            control={form.control}
            name="address"
            render={({ field }: { field: any }) => (
              <FormItem className="mb-2">
                <FormLabel className="text-base mb-1">Wallet Address</FormLabel>
                <FormControl className="mb-2">
                  <Input
                    type="text"
                    className="h-14 px-4 border border-primary text-sm md:text-base"
                    placeholder="0x0000000000000000000000000000000000000000"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Your address is automatically added to this field
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel className="text-base mb-1">Amount</FormLabel>
                <FormControl className="mb-2">
                  <Input
                    type="text"
                    className="h-14 px-4 border border-primary text-sm md:text-base"
                    placeholder="200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
