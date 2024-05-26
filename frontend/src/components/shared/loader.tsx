import Image from "next/image";

export default function LoadingComponent({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-svh flex-col">
      <div className="w-16 md:w-20 h-16 md:h-20">
        <Image
          src="/img/logo.png"
          alt="loader"
          width={110}
          height={110}
          quality={100}
          priority
          className="object-contain w-full h-full pointer-events-none select-none animate-pulse"
        />
      </div>
      {text && <p className="font-medium text-base mt-2">{text}</p>}
    </div>
  );
}
