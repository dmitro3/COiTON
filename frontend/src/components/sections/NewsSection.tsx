import { Clock } from "lucide-react";
import Heading from "../shared/heading";
import MaxWrapper from "../shared/wrapper";

export default function NewsSection() {
  return (
    <div className="py-20 flex-1">
      <MaxWrapper className="flex flex-col gap-6 md:gap-12">
        <Heading subtitle="All News" title="See the latest news" button />

        <div className="flex gap-6 flex-col-reverse lg:flex-row">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            {Array.from({ length: 3 }).map((_, _key) => (
              <div
                className="flex gap-4 sm:gap-6 flex-1 flex-col sm:flex-row"
                key={_key}>
                <div className="aspect-[1.6] sm:aspect-[1.2] bg-secondary w-full h-max sm:w-max sm:h-[150px] rounded-2xl overflow-hidden"></div>

                <div className="flex-1 flex flex-col">
                  <p className="text-base font-semibold">Aliyu James</p>
                  <h1 className="text-lg md:text-xl font-bold text-primary line-clamp-3">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Temporibus, maxime cumque modi culpa quam hic maiores quia
                    ullam dolorem expedita!
                  </h1>

                  <p className="flex items-center gap-2 mt-auto text-sm font-medium text-muted-foreground">
                    <Clock className="w-4 h-4" /> 4th May, 2024
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/2">
            <div className="aspect-[1.6] bg-secondary w-full rounded-2xl overflow-hidden"></div>

            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold my-1">Aliyu James</p>
              <h1 className="text-lg md:text-xl font-bold text-primary line-clamp-3">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Temporibus, maxime cumque modi culpa quam hic maiores quia ullam
                dolorem expedita!
              </h1>

              <p className="flex items-center gap-2 mt-4 text-sm font-medium text-muted-foreground">
                <Clock className="w-4 h-4" /> 4th May, 2024
              </p>
            </div>
          </div>
        </div>
      </MaxWrapper>
    </div>
  );
}
