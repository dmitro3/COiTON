import { IoIosStar } from "react-icons/io";

export default function TestimonialCard() {
  return (
    <div className="w-full max-w-[455px] bg-secondary/80 rounded-xl p-5">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, _key) => (
          <IoIosStar key={_key} className="w-6 h-6" />
        ))}
      </div>

      <p className="mt-3 mb-5 text-sm md:text-base leading-6">
        “Homes made the daunting task of relocation feel like a breeze. Their
        support and of our needs helped us settle comfortably into a new city.
        Their content of dedication to client satisfaction is commendable
        distracted by features.”
      </p>

      <div className="flex items-center gap-4">
        <div className="bg-secondary w-14 h-14 rounded-full"></div>
        <div className="flex flex-col">
          <h2 className="text-sm md:text-base font-medium">
            Cameron Williamson
          </h2>
          <p className="text-xs md:text-sm font-normal text-muted-foreground">
            Oklahoma
          </p>
        </div>
      </div>
    </div>
  );
}
