import { cn } from "@/lib/utils";

export default function MaxWrapper({ className, children }: MaxWrapperProps) {
  return (
    <div className={cn("mx-auto px-4 max-w-[1400px]", className)}>
      {children}
    </div>
  );
}
