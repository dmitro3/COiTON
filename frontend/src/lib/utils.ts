import { type ClassValue, clsx } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";

import DIAMOND_CONTRACT_ABI from "../json/diamond.json";

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {}
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (inputTime: any) => {
  // Parse the input time string
  const dateTime = new Date(inputTime);

  // Get the date components
  const year = dateTime.getFullYear();
  const month = dateTime.toLocaleString("en-US", { month: "long" });
  const day = dateTime.getDate();

  // Get the time components
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  // Construct the formatted string
  const formattedDate = `${day} ${month}, ${year}`;
  const formattedTime = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return `${formattedDate} - ${formattedTime}`;
};

export const amountFormatter = (amount: any) => {
  if (amount >= 1000000000000) {
    return (amount / 1000000000000).toFixed(0) + "t";
  } else if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(0) + "b";
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(0) + "m";
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(0) + "k";
  } else {
    return amount.toString();
  }
};

export const shortenAddress = (addr: string) => {
  return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};

export const onUpload = async (files: File[]) => {
  const uploadedFiles: string[] = [];

  try {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      };

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        options
      );
      const pinataResponse = await response.json();
      const fileUrl = pinataResponse.IpfsHash;

      if (!pinataResponse) {
        throw new Error("Failed to upload file(s) to Pinata");
      }

      uploadedFiles.push(fileUrl);
    }

    return uploadedFiles; // Return the array of uploaded files
  } catch (error) {
    console.error("Error uploading file(s) to Pinata:", error);
    throw new Error("Failed to upload file(s) to Pinata");
  }
};

export const getDiamondContract = (providerOrSigner: any) =>
  new ethers.Contract(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    DIAMOND_CONTRACT_ABI,
    providerOrSigner
  );

// read only provider pointing to sepolia. It allows read only access to the sepolia blockchain
export const readOnlyProvider = new ethers.JsonRpcProvider(
  `http://127.0.0.1:8545`
);

// read/write provider, that allows you to read data and also sign transaction on whatever chain it's pointing to
export const getProvider = (provider: any) =>
  new ethers.BrowserProvider(provider);
