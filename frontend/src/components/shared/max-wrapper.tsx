import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function MaxWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "max-w-screen-xl 2xl:max-w-screen-2xl px-4 lg:px-6 xl:px-10 2xl:px-14 mx-auto w-full",
        className
      )}>
      {children}
    </section>
  );
}
