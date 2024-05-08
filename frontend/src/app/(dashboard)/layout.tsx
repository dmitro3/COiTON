import DashboardHeader from "@/components/shared/d-header";
import Sidebar from "@/components/shared/sidebar";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-full">
      <div className="max-w-[22rem] w-full h-svh hidden sticky top-0 left-0 lg:flex p-3">
        <Sidebar />
      </div>

      <main className="flex flex-col w-full flex-1 h-full">
        <DashboardHeader />

        <div className="flex-1 h-full px-4 py-2">{children}</div>
        <Image
          src="/svg/home.svg"
          alt="home"
          width={800}
          height={800}
          quality={100}
          priority
          className="fixed -bottom-0 right-0 select-none pointer-events-none opacity-50"
        />
      </main>
    </div>
  );
}
