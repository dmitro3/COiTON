import MaxWrapper from "../shared/max-wrapper";
import { Skeleton } from "../ui/skeleton";

export default function ListingDetailsLoader() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col my-6 md:my-10 mx-auto max-w-[1050px] w-full">
        <Skeleton className="w-96 h-6 rounded-full" />
        <div className="flex flex-col gap-1 mt-4">
          <Skeleton className="w-full max-w-[calc(100%-20%)] md:max-w-[520px] h-4 rounded-full" />
          <Skeleton className="w-full max-w-[calc(100%-50%)] md:max-w-[450px] h-4 rounded-full" />
        </div>
        <div className="flex items-end justify-between mt-3 md:mt-4 pt-3 md:pt-4">
          <Skeleton className="w-32 md:w-60 h-5 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-9 md:w-11 h-9 md:h-11 rounded-full" />
            <Skeleton className="w-9 md:w-11 h-9 md:h-11 rounded-full" />
          </div>
        </div>
      </div>
      <MaxWrapper className="my-6 xl:my-6 px-0 lg:px-0 xl:px-0 2xl:px-4 flex flex-col gap-6">
        <Skeleton className="w-full aspect-[1.6] xl:aspect-[1.8] flex gap-2 flex-col xl:flex-row" />
      </MaxWrapper>
    </div>
  );
}
