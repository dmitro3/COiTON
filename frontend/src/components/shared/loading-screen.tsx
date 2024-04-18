import Image from "next/image";

import logo from "../../../public/logo.svg";

export default function LoadingScreen() {
  return (
    <div className="flex-1 w-full h-screen flex items-center justify-center bg-primary">
      <Image
        src={logo}
        alt="logo"
        className="object-cover animate-pulse w-20 h-20 md:w-28 md:h-28"
      />
    </div>
  );
}
