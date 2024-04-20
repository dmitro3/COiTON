export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 min-h-screen">
      <div className="flex-1 bg-secondary/40 border-r hidden lg:flex"></div>
      <main className="lg:max-w-[680px] w-full p-4 md:p-6">{children}</main>
    </div>
  );
}
