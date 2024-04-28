"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex items-center flex-col justify-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-3xl">Page Not Found</p>

      <Button variant="link" className="mt-4" onClick={() => router.back()}>
        Go Back
      </Button>
    </div>
  );
}
