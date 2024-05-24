import { site } from "@/constants";
import React from "react";

export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  return (
    <div className="w-full max-w-md flex flex-col">
      <h1 className="text-xl font-medium mb-2">Verify your email address</h1>
      <p className="text-sm">
        To continue using {site.name}, confirm your email address with the email
        we sent to:
      </p>
      <p className="mt-2 md:mt-4 mb-4 md:mb-6 text-base md:text-lg font-bold">
        {searchParams.message}
      </p>
    </div>
  );
}
