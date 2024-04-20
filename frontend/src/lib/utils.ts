import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Account, Client } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);

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

export const shortenAddress = (addr: string) => {
  return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
};
