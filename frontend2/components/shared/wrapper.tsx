import { cn } from "@/lib/utils";

export default function Wrapper({ className, children }: IWrapper) {
  return (
    <div
      className={cn(
        "max-w-screen-xl 2xl:max-w-screen-2xl px-4 mx-auto w-full",
        className
      )}>
      {children}
    </div>
  );
}
