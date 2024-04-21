import DashboardHeader from "@/components/shared/d-header";
import Sidebar from "@/components/shared/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-full">
      <div className="max-w-[22rem] w-full h-svh hidden sticky top-0 left-0 lg:flex">
        <Sidebar />
      </div>

      <main className="flex flex-col w-full flex-1 h-full">
        <DashboardHeader />

        <div className="flex-1 px-4 py-2">{children}</div>
      </main>
    </div>
  );
}
