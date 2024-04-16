import MaxWrapper from "@/components/shared/wrapper";

export default function RootPage() {
  return (
    <div className="flex-1">
      <MaxWrapper className="py-4">
        <div className="w-full aspect-[1.3] md:aspect-video rounded-[30px] bg-card shadow"></div>
      </MaxWrapper>
    </div>
  );
}
