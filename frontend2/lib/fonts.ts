import {
  Space_Grotesk as FontSans,
  Open_Sans as LogoSans,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const logoSans = LogoSans({
  subsets: ["latin"],
  variable: "--logo-sans",
});
