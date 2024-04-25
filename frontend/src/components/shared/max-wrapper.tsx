import { cn } from "@/lib/utils";

export default function MaxWrapper2({ className, children }: MaxWrapperProps) {
  return (
    <div className={cn("mx-auto px-4 max-w-[1200px]", className)}>
      {children}
    </div>
  );
}
