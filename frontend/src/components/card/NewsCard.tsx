/* eslint-disable @next/next/no-img-element */
import { site } from "@/constants";
import { formatDate } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function NewsCard({
  image_url,
  pubDate,
  title,
  creator,
  link,
}: {
  image_url?: string;
  link: string;
  pubDate: string;
  title: string;
  creator?: string;
}) {
  const newsImage = `${!image_url ? "/broken.jpeg" : image_url}`;

  return (
    <div key={pubDate + Math.random()} className="w-full group">
      <div className="rounded-[30px] bg-card aspect-[1.3] w-full overflow-hidden">
        <img
          src={newsImage}
          alt={title}
          width={2970}
          height={1980}
          className="w-full h-full object-cover rounded-[30px] group-hover:scale-110 transition-all"
        />
      </div>
      <div className="py-3 flex flex-col">
        <div className="flex items-center gap-2">
          {/* <p className="text-base font-semibold">
            {source.name === "[Removed]" ? site.name : source.name}
          </p> */}
          <p>-</p>
          <p className="text-sm font-medium text-muted-foreground">
            {formatDate(pubDate)}
          </p>
        </div>
        <h1 className="text-xl h-[56px] text-blue-400 md:group-hover:text-blue-400 line-clamp-2 transition-colors mb-4">
          {title}
        </h1>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-muted-foreground text-base italic">
            creator: {creator === null ? site.name : creator?.[0]}
          </p>

          <Link
            href={link}
            target="_blank"
            className="text-base font-semibold flex items-center">
            Read More <MoveRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
