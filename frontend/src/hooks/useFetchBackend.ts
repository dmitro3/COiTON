"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export const RENDER_ENDPOINT = process.env.NEXT_PUBLIC_RENDER_ENDPOINT;

export const useFetchListings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<SingleListingType[]>();

  async function fetchData() {
    setIsLoading(true);

    try {
      const response = await fetch(`${RENDER_ENDPOINT}/listings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        toast("Failed to create listing");
        throw new Error("Failed to create listing");
      }
      const result = await response.json();
      setListings(result?.data?.rows);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { isLoading, listings };
};
