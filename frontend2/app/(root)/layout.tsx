import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import React from "react";

export default function LandingPageLayout({ children }: ILayout) {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
