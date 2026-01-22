import { Bricolage_Grotesque, Bubblegum_Sans, DM_Sans } from "next/font/google";

export const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const fontHeading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const fontCartoon = Bubblegum_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-cartoon"
});
