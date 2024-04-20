import MaxWrapper2 from "@/components/shared/max-wrapper";
import MobileSidebar from "@/components/shared/mobile-sidebar";
import Sidebar from "@/components/shared/sidebar";
import { site } from "@/constants";
import { shortenAddress } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
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
  return <div>{children}</div>;
}

// <div className="flex-1 bg-secondary h-screen flex">
//   <Sidebar />
//   <main className="flex-1">
//     <div className="h-full md:shadow flex-1 overflow-y-auto">
//       <div className="py-5 px-4 w-full flex items-center justify-between lg:justify-end gap-4 bg-background lg:bg-primary sticky top-0">
//         <MobileSidebar />
//         <div className="flex items-center gap-4">
//           <p className="lg:text-secondary font-semibold">
//             {shortenAddress("0x00000000000000000000000000000000000000")}
//           </p>
//           <UserButton
//             afterSignOutUrl="/"
//             signInUrl="/dashboard"
//             afterSwitchSessionUrl="/dashboard"
//           />
//         </div>
//       </div>
//       <MaxWrapper2 className="flex-1 py-2 px-4">{children}</MaxWrapper2>
//     </div>
//   </main>
// </div>
