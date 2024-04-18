import { cn } from "@/lib/utils";

export default function MaxWrapper({ className, children }: MaxWrapperProps) {
  return (
    <div className={cn("mx-auto px-4 max-w-[1320px]", className)}>
      {children}
    </div>
  );
}
