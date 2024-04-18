/* eslint-disable @next/next/no-img-element */
import { site } from "@/constants";
import { formatDate } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function NewsCard({
  urlToImage,
  publishedAt,
  title,
  source,
  author,
  url,
}: {
  urlToImage?: string;
  url: string;
  publishedAt: string;
  title: string;
  source: { name: string };
  author?: string;
}) {
  const newsImage = `${!urlToImage ? "/broken.jpeg" : urlToImage}`;

  return (
    <div key={publishedAt + Math.random()} className="w-full group">
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
          <p className="text-base font-semibold">
            {source.name === "[Removed]" ? site.name : source.name}
          </p>
          <p>-</p>
          <p className="text-sm font-medium text-muted-foreground">
            {formatDate(publishedAt)}
          </p>
        </div>
        <h1 className="text-xl h-[56px] text-blue-400 md:group-hover:text-blue-400 line-clamp-2 transition-colors mb-4">
          {title === "[Removed]"
            ? "For some reason, the author of this post removed the title for this article."
            : title}
        </h1>
        <div className="flex items-center justify-between mt-auto">
          <p className="text-muted-foreground text-base italic">
            Author: {author === null ? site.name : author}
          </p>

          <Link
            href={url}
            target="_blank"
            className="text-base font-semibold flex items-center">
            Read More <MoveRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
