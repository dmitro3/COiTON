import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (str: string, n: number = 6) => {
  return str?.length > n
    ? str.slice(0, n) + "..." + str.slice(str.length - 4, str.length)
    : str;
};

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

export const formatDate = (timestamp: any) => {
  const date = new Date(timestamp * 1000);

  const formattedDateWithTime = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return { formattedDate, formattedDateWithTime };
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
