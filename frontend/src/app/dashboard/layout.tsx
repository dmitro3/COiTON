import { site } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard - ${site.name}`,
  description: site.description,
  icons: {
    icon: "./favicon.ico",
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex-1 bg-secondary min-h-screen">{children}</main>;
}
