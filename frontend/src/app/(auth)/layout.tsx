export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 min-h-screen">
      <main className="w-full p-4 md:p-6">{children}</main>
    </div>
  );
}
