import Footer from "@/components/root/footer";
import Header from "@/components/root/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex flex-col flex-1 min-h-svh">{children}</div>
      <Footer />
    </>
  );
}
